import React from 'react';
import {
  SafeAreaView,
  View,
  FlatList,
  StyleSheet,
  Text,
  StatusBar,
} from 'react-native';

import axios from 'axios';

interface Station {
  station_id: number;
  name: string;
  lat: number;
  lon: number;
  capacity: number;
  stationCode: string;
  status: StationStatus;
}

interface StationStatus {
  stationCode: string;
  station_id: number;
  num_bikes_available: number;
  numBikesAvailable: number;
  num_bikes_available_types: Array<{}>;
  num_docks_available: number;
  numDocksAvailable: number;
  is_installed: number;
  is_returning: number;
  is_renting: number;
  last_reported: number;
}

const initStation: Station[] = [];

const Item = ({
  title,
  capacity,
  availabilities,
}: {
  title: string;
  capacity: number;
  availabilities: number;
}) => (
  <View style={styles.item}>
    <Text style={styles.title}>{title}</Text>
    <Text>Capacité : {capacity}</Text>
    <Text>Vélib disponible : {availabilities}</Text>
  </View>
);

const App = () => {
  const renderItem = ({item}: {item: Station}) => (
    <Item
      capacity={item.capacity}
      availabilities={item.status.num_bikes_available}
      title={item.name}
    />
  );

  const [stations, setStations]: [Station[], (stations: Station[]) => void] =
    React.useState(initStation);
  const [loading, setLoading]: [boolean, (loading: boolean) => void] =
    React.useState<boolean>(true);
  const [error, setError]: [string, (error: string) => void] =
    React.useState('');

  React.useEffect(() => {
    axios
      .get<Station[]>('http://localhost:8080/stations', {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(response => {
        setStations(response.data);
        setLoading(false);
      })
      .catch(ex => {
        const error =
          ex.response.status === 404
            ? 'Resource Not found'
            : 'An unexpected error has occurred';
        setError(error);
        setLoading(false);
      });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={stations}
        renderItem={renderItem}
        keyExtractor={item => item.stationCode}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    backgroundColor: 'lightgray',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
});

export default App;
