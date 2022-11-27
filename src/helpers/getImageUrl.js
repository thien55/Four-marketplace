import base64 from 'react-native-base64';
/* eslint-disable-next-line import/extensions, import/no-unresolved */
import config from '../aws-exports';
import envConfig from '../config';


const { aws_user_files_s3_bucket: AWSbucket } = config;

export default function getImageUrl(imageKey, height) {
  const imageRequest = JSON.stringify({
    bucket: AWSbucket,
    key: `public/${imageKey}`,
    edits: {
      resize: {
        height,
        fit: 'contain',
      },
    },
  });
  const url = `${envConfig.resizeEndpoint.key}/${base64.encode(imageRequest)}`;
  return url;
}
