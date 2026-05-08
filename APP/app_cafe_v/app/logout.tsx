import { Image } from 'expo-image';
import { Platform, StyleSheet } from 'react-native';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';
import { useEffect, useState } from "react";
import { Button } from '@/components/ui/button';
import { useAuthSession } from '@/src/auth/AuthProvider';
import { router } from 'expo-router';

export default function HomeScreen() {

  const {signOut, token} = useAuthSession()
  const [tokenInUi, setTokenInUi] = useState<null|string|undefined>(null)

  const logout = async () => {
    await signOut();
    router.replace('/');
  }

  const callApi = () => {
    setTokenInUi(token?.current);
  }





  return (
    <ThemedView>

      <ThemedView
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        backgroundColor: '#FFFFFF'
      }}
    >
      <ThemedText>Logout</ThemedText>
      <Button title={"Logout"} onPress={logout}/>
      <ThemedView style={{
        paddingTop: 20
      }} />
      <ThemedText>Make an API call with the stored AUTH token</ThemedText>
      <Button title={"Call API"} onPress={callApi} />
      {tokenInUi &&
        <ThemedText>{`Your API access token is ${tokenInUi}`}</ThemedText>
      }
    </ThemedView>

    </ThemedView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    width: "100%",
    height: "100%",
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },

  // table: {
  //   width: "100%",
  //   marginTop: 12,
  //   marginBottom: 20,
  //   backgroundColor: "#fff",
  //   borderWidth: 1,
  //   borderColor: "#e5e7eb",
  //   borderRadius: 8,
  //   overflow: "hidden",
  // },
  
  
});
