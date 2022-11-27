/* eslint-disable react-native/no-inline-styles */
import React, {useLayoutEffect, useRef, useEffect, useState} from 'react';
import {
  View,
  Image,
  StyleSheet,
  FlatList,
  useWindowDimensions,
} from 'react-native';
import {equals, isEmpty} from 'ramda';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import generalStyles from '../../styles/styles';
import mapStyle from '../../styles/MapStyle';
import {searchForProperties} from '../../helpers/utils';
import Input from '../../components/Input';
import PropertyBox from '../../components/PropertyBox';
import Button from '../../components/Button';
import Tabs from '../../components/Tabs';
import {useTabsValue} from '../../hooks';
import LoadingSpinner from '../../components/LoadingSpinner';
import NoItemsMessage from '../../components/NoItemsMessage';
import {getFilteredProperties} from '../../redux/actions';
import PageHeader from '../../components/PageHeader';

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    flexDirection: 'row',
    height: 33,
    borderBottomColor: '#E0E0E0',
    borderBottomWidth: 1,
    marginTop: 5,
    backgroundColor: 'rgba(249, 249, 249, 0.75)',
  },
});
const tabs = [
  {
    title: 'Map View',
    value: 'map',
    source: require('../../static/icons/map-pin.png'),
    size: {width: 12, height: 14, marginRight: 7},
  },
  {
    title: 'List View',
    value: 'list',
    source: require('../../static/icons/list.png'),
    size: {width: 15, height: 15, marginRight: 7},
  },
];
function MapScreen() {
  const [searchText, setSearchText] = useState('');
  const map = useRef(null);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const route = useRoute();
  const window = useWindowDimensions();
  const properties = useSelector((state) => state.merchants.properties);
  const filters = useSelector((state) => state.merchants.filters);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [emptySearch, setEmptySearch] = useState(false);
  const [region, setRegion] = useState({
    latitude: 40.000912,
    longitude: -83.008049,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  });
  const [selectedProperty, setSelectedProperty] = useState(null);
  const tab = useTabsValue('map');

  const searchItems = (query) => {
    setEmptySearch(false);
    tab.selectTab('list');
    setSelectedProperty(null);
    if (isEmpty(query) || query.length < 3) {
      if (isEmpty(query) && filters) {
        const filtersObject = {
          types: '',
          areas: filters.areas.join(','),
          amenities: filters.amenities.join(','),
          bedrooms: filters.bedrooms.join(','),
          bathrooms: filters.bathrooms.join(','),
          minPrice: parseFloat(filters.minPrice),
          maxPrice: parseFloat(filters.maxPrice),
          leaseStarting: filters.leaseStarting,
          rentRangeType: filters.rentRangeType,
          merchantId: filters.merchantId,
          searchText: '',
        };
        setFilteredProperties([]);
        dispatch(
          getFilteredProperties(
            filtersObject,
            route.params ? route.params.merchantId : null,
          ),
        );
      } else {
        setFilteredProperties(properties);
      }
    } else {
      const filterProperties = searchForProperties(query, properties);
      if (isEmpty(filterProperties)) {
        setEmptySearch(true);
      }
      setFilteredProperties(filterProperties);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      header: () => (
        <PageHeader
          title={!route.params ? 'Property Search' : route.params.merchant}
        />
      ),
    });
  }, [navigation, dispatch, route.params]);
  useEffect(() => {
    setFilteredProperties(properties);
  }, [properties]);
  const navigateTo = () => {
    setSelectedProperty(null);
    navigation.navigate('Filters', {
      id: route.params ? route.params.merchantId : null,
      searchText,
    });
  };
  const onTabSelection = (selectedTab) => {
    tab.selectTab(selectedTab);
  };
  const displayProperty = (property) => {
    map.current.animateToRegion(
      {
        latitude: property.address.location.lat,
        longitude: property.address.location.lng,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      },
      500,
    );
    setSelectedProperty(property);
  };
  const renderMarkers = (propertyList) => {
    return propertyList.map(
      (property) =>
        property.units.items.length > 0 && (
          <Marker
            key={property.id}
            title={property.marketingName}
            coordinate={{
              latitude: property.address.location.lat,
              longitude: property.address.location.lng,
            }}
            onPress={() => displayProperty(property)}>
            <Image
              source={require('../../static/icons/location-pin.png')}
              style={{width: 30, height: 30}}
            />
          </Marker>
        ),
    );
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
      }}>
      <View
        style={{
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
        }}>
        <Input
          inputContainer={[
            generalStyles.searchInputContainer,
            {marginHorizontal: 15, width: window.width / 1.5},
          ]}
          inputStyle={generalStyles.inputStyle}
          iconStyle={{marginHorizontal: 20}}
          autoCorrect={false}
          value={searchText}
          onChangeValue={(text) => setSearchText(text)}
          onChange={(e) => searchItems(e.nativeEvent.text)}
          source={require('../../static/icons/search.png')}
          placeholder="Search"
          returnKeyType="done"
        />
        <Button
          text="Filters"
          path={require('../../static/icons/filters.png')}
          iconStyle={{width: 15, height: 15}}
          textStyle={generalStyles.filterButtonTextStyle}
          navigateTo={navigateTo}
        />
      </View>
      <Tabs
        tabs={tabs}
        onTabSelection={onTabSelection}
        selected={tab.value}
        container={styles.container}
        displayIcon
      />
      {isEmpty(filteredProperties) && !emptySearch && <LoadingSpinner />}
      {emptySearch && (
        <NoItemsMessage text="No properties matched your search request." />
      )}
      {equals(tab.value, 'map') ? (
        <View style={{flex: 1, width: '100%'}}>
          {filteredProperties.length > 0 && (
            <MapView
              ref={map}
              initialRegion={region}
              provider={PROVIDER_GOOGLE}
              style={styles.map}
              showsCompass={false}
              showsScale
              customMapStyle={mapStyle}
              zoomEnabled>
              {filteredProperties.length > 0 &&
                renderMarkers(filteredProperties)}
            </MapView>
          )}
          {selectedProperty && (
            <PropertyBox
              selectedProperty={selectedProperty}
              map
              propertyBoxStyle={{
                position: 'absolute',
                bottom: 20,
                width: window.width / 1.35,
                height: 200,
                alignSelf: 'center',
              }}
            />
          )}
        </View>
      ) : (
        <FlatList
          contentContainerStyle={{
            alignItems: 'center',
            justifyContent: 'center',
          }}
          showsVerticalScrollIndicator={false}
          data={filteredProperties}
          initialNumToRender={10}
          maxToRenderPerBatch={5}
          updateCellsBatchingPeriod={500}
          windowSize={5}
          renderItem={({item: property, index}) =>
            property.units.items.length > 0 && (
              <View key={index} style={{marginVertical: 5}}>
                <PropertyBox
                  selectedProperty={property}
                  propertyBoxStyle={{
                    width: window.width / 1.15,
                    height: 225,
                    alignSelf: 'center',
                    marginVertical: 10,
                  }}
                />
              </View>
            )
          }
        />
      )}
    </View>
  );
}

export default MapScreen;
