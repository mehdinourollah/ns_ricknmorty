<template>
  <Page @loaded="onLoaded">
    <ActionBar title="" flat="true">
      <StackLayout orientation="horizontal">
        <Label
          color="white"
          :text="character ? character.name : ''"
          
          textWrap="true"
          verticalAlignment="middle"
        />
        <Image
          v-if="character"
          :src="character ? character.image : ''"
          height="20"
          width="20"
          stretch="aspectFill"
        />
      </StackLayout>
      <NavigationButton
        text="Back"
        android.systemIcon="ic_menu_back"
        @tap="goBack"
      />
      <ActionItem
        icon=""
        android.systemIcon="ic_menu_home"
        text="Home"
        ios.position="left"
        @tap="goHome"
      />
    </ActionBar>
    <StackLayout>
      <ActivityIndicator
        :busy="!isLoaded"
        @busyChange="onBusyChanged"
        v-if="!isLoaded"
        marginTop="10"
        width="100"
        height="100"
      />
      <StackLayout v-else>
        <Image height="100" :src="character.image" />
        <StackLayout>
          <Label :text="character.name" textWrap="true" />
          <Label :text="character.status" textWrap="true" />
          <Label :text="character.species" textWrap="true" />
          <Label :text="character.type" textWrap="true" />
          <Label :text="character.gender" textWrap="true" />

          <!-- TODO: make it clickable with link url -->
          <Label :text="character.origin.name" textWrap="true" />
        </StackLayout>

        <ListView
          for="(e,index) in character.episode"
          @itemTap="onItemTap"
          height="auto"
        >
          <v-template>
            <StackLayout>
              <Label :text="e" />
            </StackLayout>
          </v-template>
        </ListView>
      </StackLayout>
    </StackLayout>
  </Page>
</template>

<script>
import axios from "axios";
import Episode from "./Episode";
import Home from "./Home";

export default {
  props: ["character_url"],

  data() {
    return {
      isLoaded: false,
      character: {},
      url: "",
    };
  },
  mounted() {},

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
      this.gotoEpisode(item);
    },
    gotoEpisode(item) {
      // console.log({item})
      this.$navigateTo(Episode, {
        props: {
          episode_url: item.item,
        },
      });
    },
    onLoaded() {
      this.getCharacter();
      // console.log('URL: ' +this.character_url)
    },
    getCharacter() {
      this.isLoaded = false;

      axios(this.character_url)
        .then((res) => {
          console.log(res);
          this.character = res.data;
          this.isLoaded = true;
          return;
          this.episode = res.data;
          console.log({ res });
          this.isLoaded = true;
          return;
          console.log("Pages: " + pages);
          let requestsPromises = [];
          for (let i = 1; i <= pages; i++) {
            requestsPromises.push(
              axios("https://rickandmortyapi.com/api/episode?page=" + i)
            );
          }
          let episodes = [];

          Promise.all(requestsPromises)
            .then((results) => {
              results
                .map((x) => x.data.results)
                .forEach((x) => {
                  episodes.push(...x);
                });
              console.log("Finished");
              this.episodes = episodes;
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
@import "~@nativescript/theme/scss/variables/blue";
</style>
