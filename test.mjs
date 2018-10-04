import Vue from 'vue'
import { mount } from '@vue/test-utils'
import ImageCompare from './src/image-compare.vue'
import MinimalTest from './test/minimal.vue'

describe('Visual image compare', () => {
  it('renders images into a default 16x9 container', () => {
    const wrapper = mount(MinimalTest, {
      attachToDocument: true
    })
    const imgcomp = wrapper.find(ImageCompare)
    expect(imgcomp).toBeTruthy()
    expect(imgcomp.find('.img-ctn')).toBeTruthy()
    expect(imgcomp.findAll('.img-ctn img').length).toBe(2)
    expect(imgcomp.props('width')).toBe(16)
    expect(imgcomp.props('height')).toBe(9)
  })
})
