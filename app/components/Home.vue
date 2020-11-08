<template>
  <Page @loaded="onLoaded" backgroundSpanUnderStatusBar="true">
    <ActionBar title="" icon="">
      <Label color="white" text="Rick n Morty Episodes" textWrap="true" />
      
      <!-- <NavigationButton text="Back" android.systemIcon="ic_menu_back" @tap="goBack" /> -->
      <!-- <ActionItem icon="" text="Left" ios.position="left" @tap="" />
      <ActionItem icon="" text="Right" ios.position="right" @tap="" /> -->
    </ActionBar>
    <StackLayout>
      <Label text="is loading..." textWrap="true" v-if="!isLoaded" />

      <ListView for="(e,index) in episodes" v-else @itemTap="onItemTap">
        <v-template>
          <StackLayout>
            <!-- Shows the list item label in the default color and style. -->
            <Label :text="e.name" />
            <Label :text="e.air_date" />
            <Label :text="e.episode" />
          </StackLayout>
        </v-template>
      </ListView>
    </StackLayout>
  </Page>
</template>

<script>
import Episode from "./Episode";
import axios from "axios";

export default {
  data() {
    return {
      isLoaded: false,
      episodes: [],
      url: "",
    };
  },
  mounted() {
    // this.getEpisodes();
  },

  methods: {
    onItemTap(item) {
      this.gotoEpisode(item);
    },
    gotoEpisode(item) {
      // console.log({item})
      this.$navigateTo(Episode, {
        props: {
          episode_url:item.item.url,
        },
      });
    },
    onLoaded() {
      this.getEpisodes();
    },
    getEpisodes() {
      this.isLoaded = false;
      console.log("Started");
      axios("https://rickandmortyapi.com/api/episode")
        .then((res) => {
          let pages = res.data.info.pages;
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
