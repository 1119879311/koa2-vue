<template>
    <div class="scoll-viw-warp">
			<div class="swiper-container">
				<div class="swiper-wrapper">
					<div class="swiper-slide slider-itme-first" style="background: rgba(123,255,122,0.3);">
                        <div class="content-main-sillder part-1">
                            <h3 class="title">书之风-天高任鸟飞</h3>
                        </div>
					</div>
                    <div class="swiper-slide slider-itme-first" style="background: rgba(100,75,228,0.5);">
                         <div class="content-main-sillder">
                           
                        </div>
					</div>
                </div>
                <div class="swiper-pagination"></div>
            </div>   
    </div>
</template>

<script>

	
    import Swiper from 'swiper';
    export default {
        data() {
            return {
               
            }
        },
        mounted(){
            this.swiperInit()
        },
        methods: {
            swiperInit:function(){
                var swiper = new Swiper('.swiper-container', {
            		direction: 'vertical',
            		followFinger: false,
            		speed: 400,
                    mousewheel: true,
                    observer:true,
            		pagination: {
            			el: '.swiper-pagination',
            			 clickable: true,
            		},
            		on: {
            			init: function(swiper) {
            			    var	slide = this.slides.eq(0);
            				slide.addClass('ani-slide');
            			},
            			transitionStart: function() {
            				for(var i = 0; i < this.slides.length; i++) {
            					var slide = this.slides.eq(i);
            					slide.removeClass('ani-slide');
            				}
            			},
            			transitionEnd: function() {
            				var slide = this.slides.eq(this.activeIndex);
            				 slide.addClass('ani-slide');

            			},
            		}
            	});
            }
        }
    }
</script>

<style>
.scoll-viw-warp{
	position: absolute;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	width: 100%;
}
.scoll-viw-warp .swiper-wrapper {
	transition-delay: .3s;
	height: 100%;
	width: 100%;
}

.scoll-viw-warp .swiper-container {
	width: 100%;
	height: 100%;
	margin: 0 auto;
}

.scoll-viw-warp .swiper-slide.silder-center {
	text-align: center;
	font-size: 18px;
	width: 100%;
	width: 100%;
	/* Center slide text vertically */
	display: flex;
	justify-content: center;
	align-items: center;
}
.content-main-sillder{
    max-width:1200px;
    margin:0px auto;
    height:100%;
    padding:20px 12px;
    display: flex;
	justify-content: center;
	align-items: center;
    color:#fff;
}

.scoll-viw-warp .swiper-container .swiper-pagination{
	bottom: 16px;
	right: 18px;
}
.scoll-viw-warp .swiper-container-vertical>.swiper-pagination-bullets .swiper-pagination-bullet {		
	width:14px;
	height:14px;
	background:#fff;
	opacity:1;
	margin-bottom: 16px;
}
.scoll-viw-warp .swiper-container-vertical>.swiper-pagination-bullets .swiper-pagination-bullet.swiper-pagination-bullet-active{
	background: #7FC6B8;
}
.part-1{
	color: #000;
}
</style>