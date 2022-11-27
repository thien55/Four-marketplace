import analytics from '@react-native-firebase/analytics';

export default async function logAnalyticsEvent(event, item) {
  try {
    await analytics().logEvent(event, item);
    // console.log('Event Logged: ', event);
  } catch (error) {
    console.log('Analytics error', error);
  }
}
