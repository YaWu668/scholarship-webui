<template>
  <img :src="imageUrl" @load="handleLoad" @error="handleError" />
</template>
  
  <script>
import axios from "axios";

export default {
  props: {
    src: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      imageUrl: ""
    };
  },
  mounted() {
    this.loadImage();
  },
  methods: {
    async loadImage() {
      try {
        const response = await axios.get(this.src, {
          headers: {
            Authorization: `${localStorage.getItem("user_token")}`
          },
          responseType: "blob"
        });

        const blob = new Blob([response.data], {
          type: response.headers["content-type"]
        });

        this.imageUrl = URL.createObjectURL(blob);
      } catch (error) {
        console.error("图片加载失败:", error);
        this.imageUrl = "-"; // 错误占位图
      }
    },
    handleLoad() {
      URL.revokeObjectURL(this.imageUrl); // 图片加载成功后释放资源
    },
    handleError() {
      this.imageUrl = "-";
    }
  },
  beforeDestroy() {
    if (this.imageUrl.startsWith("blob:")) {
      URL.revokeObjectURL(this.imageUrl);
    }
  }
};
</script>