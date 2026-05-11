import * as React from 'react';
import { StyleSheet } from 'react-native';
import { View,Text, useWindowDimensions } from 'react-native';
// import { TabView, SceneMap } from 'react-native-tab-view';

const now = new Date();

// const renderScene = SceneMap({
//     music: MusicRoute,
//     albums: AlbumsRoute,
//   });

// const renderScene = ({ route, jumpTo }) => {
//     switch (route.key) {
//       case 'music':
//         return <MusicRoute jumpTo={jumpTo} />;
//       case 'albums':
//         return <AlbumsRoute jumpTo={jumpTo} />;
//     }
//   };

// const routes = [
//   { key: 'first', title: 'First' },
//   { key: 'second', title: 'Second' },
// ];

export default function App() {
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);

  return (
    <View>
        <Text style={styles.subtitle}>Date {now.toDateString()} </Text>
        <Text style={styles.subtitle}>Time {now.toLocaleTimeString()}</Text>
    </View>
    // <TabView
    //   navigationState={{ index, routes }}
    //   renderScene={renderScene}
    //   onIndexChange={setIndex}
    //   initialLayout={{ width: layout.width }}
    // />
  ); 
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: 720,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  header: {
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
  },
  subtitle: {
    marginBottom: 16,
    fontSize: 16,
    opacity: 0.8,
    color: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
});

