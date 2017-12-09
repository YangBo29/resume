/**
 * Created by yangbo on 2017/12/6.
 */

let loadingRender = (function ($) {
    let $loadingBox = $('.loadingBox'),
        $doing = $loadingBox.find('.doing');
    let imgList = ["img/icon.png", "img/zf_concatAddress.png", "img/zf_concatInfo.png", "img/zf_concatPhone.png", "img/zf_course.png", "img/zf_course1.png", "img/zf_course2.png", "img/zf_course3.png", "img/zf_course4.png", "img/zf_course5.png", "img/zf_course6.png", "img/zf_cube1.png", "img/zf_cube2.png", "img/zf_cube3.png", "img/zf_cube4.png", "img/zf_cube5.png", "img/zf_cube6.png", "img/zf_cubeBg.jpg", "img/zf_cubeTip.png", "img/zf_emploment.png", "img/zf_messageArrow1.png", "img/zf_messageArrow2.png", "img/zf_messageChat.png", "img/zf_messageKeyboard.png", "img/zf_messageLogo.png", "img/zf_messageStudent.png", "img/zf_outline.png", "img/zf_phoneBg.jpg", "img/zf_phoneDetail.png", "img/zf_phoneListen.png", "img/zf_phoneLogo.png", "img/zf_return.png", "img/zf_style1.jpg", "img/zf_style2.jpg", "img/zf_style3.jpg", "img/zf_styleTip1.png", "img/zf_styleTip2.png", "img/zf_teacher1.png", "img/zf_teacher2.png", "img/zf_teacher3.jpg", "img/zf_teacher4.png", "img/zf_teacher5.png", "img/zf_teacher6.png", "img/zf_teacherTip.png"];
    let total = imgList.length,
        cur = 0;
    let computed = function () {
        imgList.forEach(function (item) {
            let temp = new Image;
            temp.src = item;
            temp.onload = function () {
                cur++;
                runFn();
                temp = null;
            };
        })
    };

    let runFn = function () {
        $doing.css('width', cur / total * 100 + '%');
        if (cur >= total) {
            // 需要加载的图片都已经加载完成了
            let delayTimer = setTimeout(()=> {
                $loadingBox.remove();
                phoneRender.init();
                clearTimeout(delayTimer);
            }, 1000);
        }
    };

    return {
        init: function () {
            $loadingBox.css('display', 'block');
            computed();
        }
    }
})(Zepto);

let phoneRender = (function ($) {
    let $phoneBox = $('.phoneBox'),
        $time = $phoneBox.find('.time'),
        $listen = $phoneBox.find('.listen'),
        $listenTouch = $listen.find('.touch'),
        $detail = $phoneBox.find('.detail'),
        $detailTouch = $detail.find('.touch');
    let audioBell = $('#audioBell')[0],
        audioSay = $('#audioSay')[0];

    let $phonePlan = $.Callbacks();

    // 进入下一个界面
    let enterNext = function () {
        audioSay.pause();
        $phoneBox.remove();
        messageRender.init();
    };

    // 进入接听状态
    $phonePlan.add(function () {
        $listen.remove();
        $detail.css('transform', 'translateY(0)');
    });
    // 播放接听语音
    $phonePlan.add(function () {
        audioBell.pause();
        audioSay.play();
        $time.css('display', 'block');
        let sayTimer = setInterval(()=> {
            // 总时间和当前时间
            let duration = audioSay.duration,
                current = audioSay.currentTime;

            let minute = Math.floor(current / 60),
                second = Math.floor(current - minute * 60);

            minute < 10 ? minute = '0' + minute : null;
            second < 10 ? second = '0' + second : null;

            $time.html(minute + ':' + second);

            if (current >= duration) {
                clearInterval(sayTimer);
                enterNext();
            }
        }, 1000);
    });
    // 接听事件
    $phonePlan.add(()=> {
        $detailTouch.tap(enterNext)
    });

    return {
        init: function () {
            $phoneBox.css('display', 'block');
            // 铃声播放
            audioBell.play();
            audioBell.volume = 0.2;
            $listenTouch.tap($phonePlan.fire);
        }
    }
})(Zepto);

let messageRender = (function ($) {
    let $messageBox = $('.messageBox'),
        $talkBox = $messageBox.find('.talkBox'),
        $talkList = $talkBox.find('li'),
        $keyBord = $messageBox.find('.keyBord'),
        $keyBordText = $keyBord.find('span'),
        $submit = $keyBord.find('.submit'),
        musicAudio = $('#musicAudio')[0];

    // 控制消息列表逐条显示
    let step = -1,
        autoTimer = null,
        interval = 1200,
        offset = 0;
    let $plan = $.Callbacks();

    let textMove = function () {
        let text = $keyBordText.html();
        $keyBordText.css('display', 'block').html('');
        let timer = null,
            n = -1;
        timer = setInterval(function () {
            if (n >= text.length) {
                $submit.css('display', 'block').tap(()=> {
                    $keyBordText.css('display', 'none');
                    $keyBord.css('transform', 'translateY(3.7rem)');
                    $plan.fire();
                });
                clearInterval(timer);
            }
            n++;
            $keyBordText[0].innerHTML += text.charAt(n);
        }, 200);
    };

    $plan.add(()=> {
        autoTimer = setInterval(function () {
            step++;
            let $cur = $talkList.eq(step);
            $talkList.eq(step).css({
                opacity: 1,
                transform: 'translateY(0)'
            });
            if (step === 2) {
                $cur.one('transitionend', ()=> {
                    $keyBord.css('transform', 'translateY(0)').one('transitionend', textMove);
                });
                clearInterval(autoTimer);
            }

            if (step >= 4) {
                offset += -$cur[0].offsetHeight;
                $talkBox.css({
                    transform: 'translateY(' + offset + 'px)'
                });
            }
            if (step >= $talkList.length - 1) {
                clearInterval(autoTimer);
                let delayTimer = setTimeout(function () {
                    musicAudio.pause();
                    $messageBox.remove();
                    cubeRender.init();
                    clearTimeout(delayTimer);
                }, interval);
            }
        }, interval);
    });

    return {
        init: function () {
            $messageBox.css('display', 'block');
            musicAudio.play();
            $plan.fire();
        }
    }
})(Zepto);

$(document).on('touchstart touchmove touchend', function (e) {
    e.preventDefault();
});

let cubeRender = (function ($) {
    // 只要在移动端浏览器中实现滑动操作，都需要把浏览器默认的滑动行为禁止掉
    let $cubeBox = $('.cubeBox'),
        $box = $cubeBox.find('.box');

    let touchBegin = function (e) {
        // this => 原生JS对象
        let point = e.changedTouches[0];
        $(this).attr({
            x: point.clientX,
            y: point.clientY,
            isMove: false,
            changeX: 0,
            changY: 0
        })
    };

    let touching = function (e) {
        let point = e.changedTouches[0],
            $this = $(this),
            changeX = point.clientX - parseFloat($this.attr('x')),
            changeY = point.clientY - parseFloat($this.attr('y'));
        if (Math.abs(changeX) > 10 || Math.abs(changeY) > 10) {
            $this.attr({
                isMove: true,
                changeX: changeX,
                changeY: changeY
            })
        }
    };

    let touchEnd = function (e) {
        let point = e.changedTouches[0],
            $this = $(this);
        let isMove = $this.isMove,
            changeX = parseFloat($this.attr('changeX')),
            changeY = parseFloat($this.attr('changeY')),
            rotateX = parseFloat($this.attr('rotateX')),
            rotateY = parseFloat($this.attr('rotateY'));
        if (isMove === 'false') return;
        rotateX = rotateX - changeY / 3;
        rotateY = rotateY + changeX / 3;
        $this.css(`transform`, `scale(.6) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`).attr({
            rotateX: rotateX,
            rotateY: rotateY
        });
    };

    return {
        init: function () {
            $cubeBox.css('display', 'block');
            $box.attr({
                rotateX: -30,
                rotateY: 45
            }).on({
                touchstart: touchBegin,
                touchmove: touching,
                touchend: touchEnd
            });

            // 每个页面的点击操作
            $box.find('li').tap(function () {
                $cubeBox.css('display', 'none');
                let index = $(this).index();
                detailRender.init(index);
            })
        }
    }
})(Zepto);

var detailRender = (function ($) {
    let $detailBox = $('.detailBox'),
        $cubeBox = $('.cubeBox'),
        $returnLink = $('.returnLink'),
        swipeExample = null;

    let $makisuBox = $('#makisuBox');

    let change = function (example) {
        // example.activeIndex 当前活动块的索引
        // example.slides [数组]，存储了所有当前所有的活动块
        // example.slides[example.activeIndex] 当前活动块

        let {slides:slidesAry,activeIndex} = example;
        if (activeIndex === 0) {
            $makisuBox.makisu({
                selector: 'dd',
                overlap: 0.6,
                speed: 0.8
            });
            $makisuBox.makisu('open');
        }
        else {
            $makisuBox.makisu({
                selector: 'dd',
                overlap: 0,
                speed: 0
            });
            $makisuBox.makisu('close');
        }

        [].forEach.call(slidesAry, (item, index)=> {
            if (index === activeIndex) {
                item.id = 'page' + (activeIndex + 1);
                return;
            }
            item.id = null;
        })
    };

    return {
        init: function (index = 0) {
            $detailBox.css('display', 'block');

            if (!swipeExample) {
                $returnLink.tap(()=> {
                    $detailBox.css('display', 'none');
                    $cubeBox.css('display', 'block');
                });

                swipeExample = new Swiper('.swiper-container', {
                    // 如果我们选用的效果是3D的，最好不要设置无缝循环切换，在部分安卓机中，在这块的处理室友bug的
                    effect: 'coverflow',
                    onInit: change,
                    onTransitionEnd: change
                });
            }

            index = index > 5 ? 5 : index;
            swipeExample.slideTo(index, 0);
        }
    }
})(Zepto);

loadingRender.init();

