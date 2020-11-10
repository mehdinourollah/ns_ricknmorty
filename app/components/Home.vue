<template>
  <Page @loaded="onLoaded" backgroundSpanUnderStatusBar="true">
    <ActionBar class="getschwifty" flat="true">
      <Label color="white" text="Rick n Morty Episodes" textWrap="true" />
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

      <ListView
        for="(e,index) in episodes"
        v-else
        @itemTap="onItemTap"
        separatorColor="transparent"
      >
        <v-template>
          <CardView class="cardStyle" margin="1" elevation="40" radius="10">
            <StackLayout>
              <GridLayout rows="*" columns="2*,*">
                <Label col="1" textWrap="true" margin="0">
                  <FormattedString>
                    <Span :text="e.episode" fontWeight="bold" fontSize="20" />
                  </FormattedString>
                </Label>
                <StackLayout col="0">
                  <Label textWrap="true">
                    <FormattedString>
                      <Span :text="'name: '" fontWeight="bold" />
                      <Span :text="e.name" />
                    </FormattedString>
                  </Label>

                  <Label textWrap="true">
                    <FormattedString>
                      <Span :text="'air date: '" fontWeight="bold" />
                      <Span :text="e.air_date" />
                    </FormattedString>
                  </Label>
                </StackLayout>
              </GridLayout>
            </StackLayout>
          </CardView>
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
          episode_url: item.item.url,
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
