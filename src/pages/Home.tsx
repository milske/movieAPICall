import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonSearchbar,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonList,
  useIonAlert,
  useIonLoading,
} from "@ionic/react";
import { useEffect, useState } from "react";
import useApi, { SearchResult, SearchType } from "../hooks/useApi";

const Home: React.FC = () => {
  const { searchData } = useApi();

  const [searchTerm, setSearchTerm] = useState("");
  const [type, setType] = useState<SearchType>(SearchType.all);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [presentAlert] = useIonAlert();
  const [loading, dismiss] = useIonLoading();

  useEffect(() => {
    if (searchTerm === "") {
      setResults([]);
      return;
    }

    const loadData = async () => {
      await loading();
      try {
        const result: any = await searchData(searchTerm, type);
        console.log("🚀 ~ result", result);
        await dismiss();

        if (result?.Error) {
          presentAlert(result.Error);
        } else {
          setResults(result);
        }
      } catch (error) {
        await dismiss();
        presentAlert("No data found with this name.");
      }
    };

    loadData();
  }, [searchTerm]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color={"success"}>
          <IonTitle>Movie App</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonSearchbar
          value={searchTerm}
          debounce={300}
          onIonChange={(e) => setSearchTerm(e.detail.value!)}
          autocapitalize={""}
        ></IonSearchbar>
        <IonItem>
          <IonLabel>Select Searchtype</IonLabel>
          <IonSelect value={type} onIonChange={(e) => setType(e.detail.value!)}>
            <IonSelectOption value="">All</IonSelectOption>
            <IonSelectOption value="movie">Movie</IonSelectOption>
            <IonSelectOption value="series">Series</IonSelectOption>
            <IonSelectOption value="episode">Episode</IonSelectOption>
          </IonSelect>
        </IonItem>
        <IonList>
          {results.map((item: SearchResult) => (
            <IonItem key={item.imdbID}>
              <IonLabel>{item.Title}</IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Home;
