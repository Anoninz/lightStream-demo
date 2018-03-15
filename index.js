var app = new Vue({
    el: '#app',
    data: {
        data: null,
        touch: {
            startTime: null,
            endTime: null,
        },
        timer: null,
        recordTarget: false,
    },
    created() {
        this.dealText(data)
    },
    mounted() {
        const vm = this
        const body = document.querySelector('#body')
        console.log('mounted', body)
        body.addEventListener('touchmove', this.handleTouchMove)
    },
    methods: {
        dealText(data) {
            data.forEach((item1, index1) => {
                if (item1.type === 0) {
                    let result = [{
                        text: '',
                        selected: false,
                        marked: false,
                    }]
                    let arr = item1.text.text.split('')
                    for (let i = 0; i < arr.length; i++) {
                        if ('？。！'.indexOf(arr[i]) < 0) {
                            result[result.length - 1].text = result[result.length - 1].text + arr[i]
                        } else {
                            result[result.length - 1].text = result[result.length - 1].text + arr[i]
                            result.push({
                                text: '',
                                selected: false,
                                marked: false,
                            })
                        }
                    }
                    if (result[result.length - 1].text === '') {
                        result.pop()
                    }
                    data[index1].text.text = result
                }
            })
            this.data = data
        },
        handleTouchStart(event) {
            console.log('touchstart', event)
            this.timer = setTimeout(() => {
                this.longPress()
            }, 800)
        },
        longPress() {
            this.recordTarget = true
            console.log('long press')
        },
        handleTouchMove(e) {
            if (this.recordTarget) {
                e.preventDefault()
                const touch = e.changedTouches[0]
                const dom = document.elementFromPoint(touch.clientX, touch.clientY)
                const id = dom.parentNode.dataset.id
                const index = dom.dataset.index
                // console.log('接触到的 dom 的元素', id, index)
                if (id && index) {
                    this.selectDom(id, index)
                }
            }
        },
        selectDom(id, index) {
            this.data.forEach((item) => {
                if (item.id === id) {
                    item.text.text.forEach((text, textIndex) => {
                        if (parseInt(index) === textIndex) {
                            if (text.selected === false) {
                                text.selected = true
                            }
                        }
                    })
                }
            })
        },
        handleTouchEnd(event) {
            // 汇总选择的结果
            if (this.recordTarget) {
                const arr = []
                this.data.forEach(item => {
                    if(item.type === 0) {
                        item.text.text.forEach((text)=> {
                            if(text.selected === true) {
                                arr.push(text.text)
                                text.marked = true
                            }
                            // 清除选中效果
                            text.selected = false
                            
                        })
                    }
                })
                this.markedText = arr.join(' ')
            }
            // 关闭选择模式
            this.recordTarget = false
            // 清除计时器
            if (this.timer) {
                clearTimeout(this.timer)
            }
            // 输出结果
            alert(`你马克了：${this.markedText}`)
        },
    },
    
})