<template>
  <Page @loaded="onLoaded">
    <ActionBar title="" icon="">
      <Label color="white" :text="episode ? episode.episode : ''" textWrap="true" />
      
      <!-- <NavigationButton text="Back" android.systemIcon="ic_menu_back" @tap="goBack" /> -->
      <!-- <ActionItem icon="" text="Left" ios.position="left" @tap="" />
      <ActionItem icon="" text="Right" ios.position="right" @tap="" /> -->
    </ActionBar>
    <StackLayout>
      <Label text="is loading..." textWrap="true" v-if="!isLoaded" />
      <StackLayout v-else>
        <Label :text="episode.name" />
        <Label :text="episode.air_date" />
        <Label :text="episode.episode" />
        <ListView for="(c,index) in episode.characters" @itemTap="onItemTap" height="auto">
          <v-template>
            <StackLayout>
              <Label :text="c" />
            </StackLayout>
          </v-template>
        </ListView>
      </StackLayout>
    </StackLayout>
  </Page>
</template>

<script>
import axios from "axios";
import Character from "./Character";

export default {
  props: ["episode_url"],
  data() {
    return {
      isLoaded: false,
      episode: {},
      url: "",
    };
  },
 

  methods: {
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

* {
  color: black;
}
</style>
