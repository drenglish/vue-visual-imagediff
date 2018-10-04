<template>
  <figure class="imagediff-container"
    @touchstart="startSlide"
    @mousedown="startSlide">
    <div class="img-ctn" :style="{ paddingBottom: `${aspect * 100}%`}">
      <img :src="after" alt="after"
        @mousedown.prevent />
      <img :src="before" alt="before"
        @mousedown.prevent
        :style="beforeImgClip" />
    </div>
    <div class="handle"
      :style="handleStyle">
        <span :style="topHandlebarStyle" />
        <div class="handle-target" :style="targetStyle">
          <div class="arrow" :style="leftArrowStyle"></div>
          <div class="arrow" :style="rightArrowStyle"></div>
        </div>
        <span :style="bottomHandlebarStyle" />
    </div>
  </figure>
</template>

<script>
export default {
  data () {
    return {
      imgOffset: null,
      slideOffset: this.offset,
      sliding: false,
    }
  },

  props: {
    width: {
      type: Number,
      default: 16
    },
    height: {
      type: Number,
      default: 9
    },
    before: {
      type: String,
      required: true
    },
    after: {
      type: String,
      required: true
    },
    offset: {
      type: [String, Number],
      default: 0.5,
      validator: value => (value > 0 && value <= 1)
    },
    handleColor: {
      type: String,
      default: 'white'
    },
    handleWidth: {
      type: [String, Number],
      default: 1,
      validator: value => !isNaN(value)
    },
    targetSize: {
      type: [String, Number],
      default: 40,
      validator: value => !isNaN(value)
    },
    arrowHeight: {
      type: [String, Number],
      default: 10,
      validator: value => !isNaN(value)
    }
  },

  methods: {
    startSlide (event) {
      this.sliding = true
      this.moveSlide(event)
    },

    moveSlide (event) {
      if (this.sliding) {
        var x = (event.touches ? event.touches[0].pageX : event.pageX) - this.imgOffset.left
        x = (x < 0) ? 0 : ((x > this.w) ? this.w : x)

        this.slideOffset = (x / this.w)
      }
    },

    endSlide () { this.sliding = false },

    setDimensions () {
      this.imgOffset = this.$el.querySelector(".img-ctn").getBoundingClientRect()
      if (!this.imgOffset.width || !this.imgOffset.height) {
        window.requestAnimationFrame(this.setDimensions)
      }
    },

    resize () {
      this.$nextTick(() => { this.setDimensions() })
    }
  },

  computed: {
    aspect () {
      return this.height / this.width
    },

    beforeImgClip () {
      return { clip: `rect(0, ${this.x}px, ${this.h}px, 0)` }
    },

    handleStyle () {
      return {
        left: `calc(${this.slideOffset*100}% - ${this.targetSize/2}px)`,
      }
    },

    handlebarStyle () {
      return {
        border: `${this.handleWidth}px solid ${this.handleColor}`,
        left: `calc(50% - ${this.handleWidth}px)`,
      }
    },

    topHandlebarStyle () {
      return {...this.handlebarStyle, ...{top: `${-0.5 * this.targetSize - 2}px`}}
    },

    bottomHandlebarStyle () {
      return {...this.handlebarStyle, ...{bottom: `${-0.5 * this.targetSize - 2}px`}}
    },

    targetStyle () {
      return {
        border: `${2* this.handleWidth}px solid ${this.handleColor}`,
        borderRadius: `${this.targetSize + 2 * this.handleWidth}px`,
        width: `${this.targetSize}px`,
        height: `${this.targetSize}px`,
        top:  `calc(50% - ${this.targetSize/2}px)`,
      }
    },

    arrowStyle () {
      return {
        top: `calc(50% - ${this.arrowHeight}px)`,
        borderTop: `${this.arrowHeight}px solid transparent`,
        borderBottom: `${this.arrowHeight}px solid transparent`,
      }
    },

    leftArrowStyle () {
      return { ...this.arrowStyle, ...{
          left: `calc(50% - ${this.arrowHeight + 2}px)`,
          borderRight: `${this.arrowHeight}px solid ${this.handleColor}`,
        }
      }
    },

    rightArrowStyle () {
      return { ...this.arrowStyle, ...{
          right: `calc(50% - ${this.arrowHeight + 2}px)`,
          borderLeft: `${this.arrowHeight}px solid ${this.handleColor}`,
        }
      }
    },

    x () {
      return this.w * this.slideOffset
    },

    w () {
      if (this.imgOffset)
        return this.imgOffset.width
    },

    h () {
      if (this.imgOffset)
        return this.imgOffset.height
    }
  },

  async mounted () {
    this.$el.addEventListener("touchmove", this.moveSlide)
    this.$el.addEventListener("touchend", this.endSlide)
    this.$el.addEventListener("mousemove", this.moveSlide)
    this.$el.addEventListener("mouseup", this.endSlide)
    window.addEventListener("resize", this.resize)
    await this.$nextTick()
    this.setDimensions()
  },

  beforeDestroy () {
    this.$el.removeEventListener("touchmove", this.moveSlide)
    this.$el.removeEventListener("touchend", this.endSlide)
    this.$el.removeEventListener("mousemove", this.moveSlide)
    this.$el.removeEventListener("mouseup", this.endSlide)
    window.removeEventListener("resize", this.resize)
  }
}
</script>

<style lang="scss">
.imagediff-container {
  position: relative;
  overflow: hidden;
  box-sizing: content-box;
  z-index: 0;

  .img-ctn {
    position: relative;

    img {
      height: 100%;
      max-width: 100%;
      object-fit: cover;
      object-position: center;
      position: absolute;
      top: 0;
      left: 0;
      display: block;
      user-select: none;
    }
  }

  .handle {
    cursor: move;
    overflow: visible;
    position: absolute;
    top: 0;
    height: 100%;
    background: none;
    user-select: none;

    span {
      position: absolute;
      height: 50%;
    }

    .handle-target {
      position: relative;
    }

    .arrow {
      position: absolute;
      width: 0;
      height: 0;
      user-select: none;
    }
  }
}
</style>
