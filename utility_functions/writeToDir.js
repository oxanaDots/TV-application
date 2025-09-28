import * as FileSystem from "expo-file-system";
import { fetchExhibitionMaterial } from "./fetchExhibitionMaterial";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { Timestamp } from "firebase/firestore";

const DIRECTORY = FileSystem.documentDirectory + "exhibition";
const IMAGES_DIR = DIRECTORY + "/images";
const EXHIBITION_DETAILS_FILE = `${DIRECTORY}/exhibition_details.json`;

export async function writeToDir(IMAGES_DIR, EXHIBITION_DETAILS_FILE) {
  try {
    // read the contents of an images directory and exhibition/details JSON file
    const images = await FileSystem.readDirectoryAsync(IMAGES_DIR);
    const detailsDir = await FileSystem.getInfoAsync(EXHIBITION_DETAILS_FILE);

    // fetch current exhibition
    const data = await fetchExhibitionMaterial();
    console.log(data.images);

    // write to images folder and exhibition detail json file only if they are empty not to overwrite existing images
    if (images.length === 0 && data) {
      const images = data.images;

      await Promise.all(
        images.map(async (url, index) => {
          const path = `${IMAGES_DIR}/image_${index}-${Date.now()}.jpg`;
          const imageLink = await getDownloadURL(ref(getStorage(), url));
          return FileSystem.downloadAsync(imageLink, path);
        }),
      );
    } else {
      return;
    }

    const exhibitionDetails = {
      artistFirstName: data.artistFirstName,
      artistLastName: data.artistLastName,
      title: data.title,
      medium: data.medium,
      descr: data.descr,
      links: data.links,
      startsAt: data.startsAt.toDate(),
      expireAt: data.expireAt.toDate(),
    };

    const detailsJsonString = JSON.stringify(exhibitionDetails);

    if (!detailsDir.exists) {
      await FileSystem.writeAsStringAsync(
        EXHIBITION_DETAILS_FILE,
        detailsJsonString,
      );
      console.log("true");
    } else {
      console.log("false");
      return;
    }
  } catch (err) {
    console.error(err);
  }
}
