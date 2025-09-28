import * as FileSystem from "expo-file-system";
// creates file:///.../exhibitions directory
const DIRECTORY = FileSystem.documentDirectory + "exhibition";
const IMAGES_DIR = `${DIRECTORY}/images`;
const EXHIBITION_DETAILS_FILE = `${DIRECTORY}/exhibition_details.json`;

export async function fetchFromDir() {
  try {
    const images = await FileSystem.readDirectoryAsync(IMAGES_DIR);

    const files = images.map((file) => `${IMAGES_DIR}/${file}`);
    let exhibitionDetails = null;
    const exhibitionDetailsInfo = await FileSystem.getInfoAsync(
      EXHIBITION_DETAILS_FILE,
    );

    if (exhibitionDetailsInfo.exists) {
      const detailsAsString = await FileSystem.readAsStringAsync(
        EXHIBITION_DETAILS_FILE,
      );
      exhibitionDetails = JSON.parse(detailsAsString);
    }

    if (files.length > 0 && exhibitionDetails) {
      return {
        images: files,
        details: exhibitionDetails,
      };
    }
  } catch (err) {
    throw err;
  }
}
