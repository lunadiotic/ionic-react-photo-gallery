import {
	IonContent,
	IonFab,
	IonFabButton,
	IonHeader,
	IonIcon,
	IonPage,
	IonTitle,
	IonToolbar,
} from '@ionic/react';
import { camera } from 'ionicons/icons';
import './Tab2.css';

const Tab2: React.FC = () => {
	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonTitle>Gallery</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent>
				<IonFab vertical='bottom' horizontal='center' slot='fixed'>
					<IonFabButton
						onClick={() => {
							alert('clicked');
						}}
					>
						<IonIcon icon={camera}></IonIcon>
					</IonFabButton>
				</IonFab>
			</IonContent>
		</IonPage>
	);
};

export default Tab2;
