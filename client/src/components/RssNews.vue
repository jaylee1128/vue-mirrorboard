<script setup lang="ts">
import { ref } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Virtual, Autoplay } from "swiper";
import type { AutoplayOptions } from "swiper/types";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/virtual";

let news = ref<Array<string>>();

const autoPlayOptions: AutoplayOptions = {
  delay: 10000,
  pauseOnMouseEnter: false,
  disableOnInteraction: false,
};

function parseRss() {
  //console.log(import.meta.env.VITE_RSS_NEWS_URL);
  fetch("/news").then((response) =>
    response.json().then((json) => {
      let cur: Array<string> = [];
      json.forEach((item: { title: string }) => {
        cur.push(item.title);
      });

      news.value = cur;
    })
  );
  //
}

setInterval(parseRss, 1000 * 60 * import.meta.env.VITE_RSS_NEWS_REFRESH_MINUTE);
parseRss();
</script>

<template>
  <div class="news-con">
    <swiper
      :modules="[Virtual, Autoplay]"
      :slides-per-view="1"
      :space-between="50"
      virtual
      loop
      centered-slides
      :autoplay="autoPlayOptions"
    >
      <swiper-slide
        v-for="(item, index) in news"
        :key="index"
        :virtualIndex="index"
        >{{ item }}</swiper-slide
      >
    </swiper>
  </div>
</template>

<style scoped>
.news-con {
  /* background-color: brown; */
  width: 100%;
  height: 100%;
  font-size: 40px;
  align-items: center;
  display: flex;
  padding-left: 20px;
  color: rgb(230, 230, 230);
}
</style>
