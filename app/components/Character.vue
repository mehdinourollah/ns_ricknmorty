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
    <StackLayout height="*">
      <ActivityIndicator
        :busy="!isLoaded"
        v-if="!isLoaded"
        marginTop="10"
        width="100"
        height="100"
        color="black"
      />
      <StackLayout v-else height="*">
        <CardView margin="1" elevation="1" radius="5" paddingLeft="20"
          ><StackLayout paddingLeft="20" marginTop="20">
            <GridLayout rows="*" columns="*,*" height="200">
              <Image
                col="1"
                verticalAlignment="top"
                width="100%"
                :src="character.image"
                stretch="aspectFit"
                borderRadius="5"
                margin="10"
              />
              <StackLayout col="0">
                <Label textWrap="true" margin="0">
                  <FormattedString>
                    <Span :text="'name: '" fontWeight="bold" />
                    <Span :text="character.name" />
                  </FormattedString>
                </Label>
                <Label textWrap="true" margin="0">
                  <FormattedString>
                    <Span :text="'status: '" fontWeight="bold" />
                    <Span :text="character.status" />
                  </FormattedString>
                </Label>
                <Label textWrap="true" margin="0">
                  <FormattedString>
                    <Span :text="'species: '" fontWeight="bold" />
                    <Span :text="character.species" />
                  </FormattedString>
                </Label>
                <Label textWrap="true" margin="0">
                  <FormattedString>
                    <Span :text="'type: '" fontWeight="bold" />
                    <Span :text="character.type" />
                  </FormattedString>
                </Label>
                <Label textWrap="true" margin="0">
                  <FormattedString>
                    <Span :text="'gender: '" fontWeight="bold" />
                    <Span :text="character.gender" />
                  </FormattedString>
                </Label>
                <Label textWrap="true" margin="0">
                  <FormattedString>
                    <Span :text="'origin: '" fontWeight="bold" />
                    <Span :text="character.origin.name" />
                  </FormattedString>
                </Label>
              </StackLayout>
            </GridLayout>
            <Label text="episodes: " textWrap="true" margin="0" fontWeight="bold" />
            <StackLayout class="hr" />
            <ListView
              for="(e,index) in episodes"
              @itemTap="onItemTap"
              height="*"
            >
              <v-template>
                <GridLayout rows="*" columns="*,*">
                  <Label
                    col="1"
                    textWrap="true"
                    margin="0"
                    textAlignment="right"
                  >
                    <FormattedString>
                      <Span :text="e.episode" />
                    </FormattedString>
                  </Label>

                  <Label col="0" textWrap="true" margin="0">
                    <FormattedString>
                      <Span :text="e.name" fontWeight="bold" />
                    </FormattedString>
                  </Label>
                </GridLayout>
              </v-template>
            </ListView>
          </StackLayout>
        </CardView>
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

          let episode_urls = this.character.episode;

          let requestsPromises = [];

          episode_urls.forEach((x) => {
            requestsPromises.push(axios(x));
          });

          let episodes = [];
          Promise.all(requestsPromises)
            .then((results) => {
              episodes = results.map((x) => x.data);

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
</style>
