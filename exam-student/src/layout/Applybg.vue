<template>
  <div class="ApplyBg">
    <div class="index-box">
      <div class="left-top position">
        <img src="@/assets/index-images/bg-top-left.png" />
      </div>
      <div class="right-top position">
        <img src="@/assets/index-images/bg-top-right.png" />
      </div>
      <div class="left-bottom position">
        <img src="@/assets/index-images/bg-bottom-left.png" />
      </div>
      <div class="right-bottom position">
        <img src="@/assets/index-images/bg-bottom-right.png" />
      </div>
      <router-view />
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style>
.ApplyBg {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
}

.index-box {
  flex-grow: 1; /* 添加这个属性 */
  width: 100%;
  background: url("../assets/index-images/index_bg.png") no-repeat center top / 100% auto scroll;
  background-size:cover;
  background-position: center top;
  z-index: 2;
  display: flex;
  flex-direction: column;
}

.position {
  position: absolute;
  z-index: -1;
}
.left-top {
  left: 0;
  top: 0;
}
.right-top {
  right: 0;
  top: 0;
}
.left-bottom {
  left: 0;
  bottom: 0;
}
.right-bottom {
  right: 0;
  bottom: 0;
}
</style>