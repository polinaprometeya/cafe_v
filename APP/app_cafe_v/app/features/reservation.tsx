import * as React from 'react';
import { View,Text, useWindowDimensions } from 'react-native';
// import { TabView, SceneMap } from 'react-native-tab-view';


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
        <Text>Date</Text>
        <Text>Time</Text>
    </View>
    // <TabView
    //   navigationState={{ index, routes }}
    //   renderScene={renderScene}
    //   onIndexChange={setIndex}
    //   initialLayout={{ width: layout.width }}
    // />
  );
}