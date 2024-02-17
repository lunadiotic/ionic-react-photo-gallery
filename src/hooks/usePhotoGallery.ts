import { useState, useEffect } from 'react';
import { isPlatform } from '@ionic/react';

import {
	Camera,
	CameraResultType,
	CameraSource,
	Photo,
} from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { Capacitor } from '@capacitor/core';
import { base64FromPath } from '../helpers/base64FromPath';

export interface UserPhoto {
	filepath: string;
	webviewPath?: string;
}

const PHOTO_STORAGE = 'photos'; // key in local storage

export function usePhotoGallery() {
	const [photos, setPhotos] = useState<UserPhoto[]>([]);

	useEffect(() => {
		const loadSaved = async () => {
			const { value } = await Preferences.get({ key: PHOTO_STORAGE });
			const photosInPreferences = (
				value ? JSON.parse(value) : []
			) as UserPhoto[];

			for (let photo of photosInPreferences) {
				const file = await Filesystem.readFile({
					path: photo.filepath,
					directory: Directory.Data,
				});
				// Web platform only: Load the photo as base64 data
				photo.webviewPath = `data:image/jpeg;base64,${file.data}`;
			}
			setPhotos(photosInPreferences);
		};
		loadSaved();
	}, []);

	const takePhoto = async () => {
		const photo = await Camera.getPhoto({
			resultType: CameraResultType.Uri,
			source: CameraSource.Camera,
			quality: 100,
		});

		const fileName = Date.now() + '.jpeg';
		const savedFileImage = await savePicture(photo, fileName);
		const newPhotos = [savedFileImage, ...photos];
		setPhotos(newPhotos);
	};

	const savePicture = async (
		photo: Photo,
		fileName: string
	): Promise<UserPhoto> => {
		const base64Data = await base64FromPath(photo.webPath!);
		const savedFile = await Filesystem.writeFile({
			path: fileName,
			data: base64Data,
			directory: Directory.Data,
		});

		// Use webPath to display the new image instead of base64 since it's
		// already loaded into memory
		return {
			filepath: fileName,
			webviewPath: photo.webPath,
		};
	};

	return {
		photos,
		takePhoto,
		savePicture,
	};
}
