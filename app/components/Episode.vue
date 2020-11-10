<template>
  <Page @loaded="onLoaded">
    <ActionBar flat="true">
      <Label
        color="white"
        :text="episode ? episode.episode : ''"
        textWrap="true"
      />

      <NavigationButton
        text="Back"
        android.systemIcon="ic_menu_back"
        @tap="goBack"
      />
      <ActionItem
        text="Home"
        android.systemIcon="ic_menu_home"
        ios.position="left"
        @tap="goHome"
      />
    </ActionBar>
    <StackLayout>
      <ActivityIndicator
        :busy="!isLoaded"
        v-if="!isLoaded"
        marginTop="10"
        width="100"
        height="100"
      />
      <CardView v-else margin="10" elevation="40" radius="5">
        <StackLayout paddingLeft="20" marginTop="20">
          <Label textWrap="true" margin="0">
            <FormattedString>
              <Span :text="episode.name" fontWeight="bold" fontSize="20" />
            </FormattedString>
          </Label>
          <!-- <Label :text="episode.name" /> -->
          <Label :text="episode.air_date" />
          <Label :text="episode.episode" />
          <Label text="Characters: " textWrap="true" />

          <ListView
            for="(c,index) in characters"
            @itemTap="onItemTap"
            height="auto"
            marginTop="10"
          >
            <v-template>
              <StackLayout height="auto">
                <Label :text="c.name" />
              </StackLayout>
            </v-template>
          </ListView>
        </StackLayout>
      </CardView>
    </StackLayout>
  </Page>
</template>

<script>
import axios from "axios";
import Character from "./Character";
import Home from "./Home";

export default {
  props: ["episode_url"],
  data() {
    return {
      isLoaded: false,
      episode: {},
      characters: [],
      url: "",
    };
  },

  methods: {
    goBack() {
      this.$navigateBack();
    },
    goHome() {
      this.$navigateTo(Home, {
        // for clearing the previous routes (backstack)
        clearHistory: true,
      });
    },
    onItemTap(item) {
      this.gotoCharacter(item.item);
    },
    gotoCharacter(url) {
      this.$navigateTo(Character, {
        props: {
          character_url: url,
        },
      });
    },
    onLoaded() {
      this.getEpisode();
    },
    getEpisode() {
      this.isLoaded = false;

      axios(this.episode_url)
        .then((res) => {
          this.episode = res.data;

          let characters_urls = this.episode.characters;

          let requestsPromises = [];

          characters_urls.forEach((x) => {
            requestsPromises.push(axios(x));
          });

          let characters = [];
          Promise.all(requestsPromises)
            .then((results) => {
              characters = results.map((x) => x.data);

              this.characters = characters;

              this.isLoaded = true;
            })
            .catch((err) => console.log(err));
          // });
        })
        .catch((err) => {
          console.log(err);
          alert("Network error!");
        });
    },
  },
};
</script>

<style scoped lang="scss">


* {
  color: black;
}
</style>
