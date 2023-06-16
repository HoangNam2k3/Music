// 
// 1. Render songs
// 2. Scroll top
// 3. Play / pause / seek
// 4. CD rotate
// 5. Next / Prev 
// 6. Random
// 7. Next / Repeat when ended
// 8. Active song
// 9. Scroll active song into view
// 10. Play song when click
// 
const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const PLAYER_STORAGE_KEY = 'APP_PLAYER'

const playList = $('.playlist')

const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')

const cd = $('.cd')

const player = $('.player')
const btnPlay = $('.btn-toggle-play')

const progress = $('#progress')

const btnNext = $('.btn-next')
const btnPrev = $('.btn-prev')
const btnRand = $('.btn-random')
const btnRepeat = $('.btn-repeat')

const app = {
    currentIndex: 0,
    isRandom: false,
    isRepeat: false,
    isPlaying: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: 'Alone',
            singer: 'Alan Walker',
            path: './assets/music/Alone.mp3',
            image: './assets/img/alone.jpg'
        },
        {
            name: 'Faded',
            singer: 'Alan Walker',
            path: './assets/music/Faded.mp3',
            image: './assets/img/faded.jpg'
        },
        {
            name: 'The Spectre',
            singer: 'Alan Walker',
            path: './assets/music/TheSpectre.mp3',
            image: './assets/img/Alan_Walker_The_Spectre.jpg'
        },
        {
            name: 'On my way',
            singer: 'Alan Walker, Farruko',
            path: './assets/music/OnMyWay.mp3',
            image: './assets/img/on-my-way.jpg'
        },
        {
            name: 'Waiting for love',
            singer: 'Avicii',
            path: './assets/music/WaitingForLove.mp3',
            image: './assets/img/waiting-for-love.jpg'
        },
        {
            name: 'Shape of you',
            singer: 'Ed Sheeran',
            path: './assets/music/ShapeofYou.mp3',
            image: './assets/img/shap-of-you.jpg'
        },
        {
            name: 'Comethru',
            singer: 'Jeremy Zucker',
            path: './assets/music/Comethru.mp3',
            image: './assets/img/comethru.jpg'
        },
        {
            name: 'K-391 Ignite',
            singer: 'Alan Walker, K-391',
            path: './assets/music/K-391-Ignite.mp3',
            image: './assets/img/k391-ignite.jpg'
        },
        {
            name: 'Sunroof',
            singer: 'Nicky Youre',
            path: './assets/music/Sunroof.mp3',
            image: './assets/img/sunroof.jpg'
        },
        {
            name: 'Thằng Điên',
            singer: 'JustaTee, Phương Ly',
            path: './assets/music/ThangDien.mp3',
            image: './assets/img/thangdien.jpg'
        },
        {
            name: 'Dance monkey',
            singer: 'Tones and I',
            path: './assets/music/DanceMonkey.mp3',
            image: './assets/img/dance-monkey.jpg'
        },
        {
            name: 'See you again',
            singer: 'Wiz Khalifa',
            path: './assets/music/SeeYouAgain.mp3',
            image: './assets/img/see-you-again.jpg'
        },
    ],
    setCofig: function(key, value){
        this.config[key] = value

        localStorage.setItem(PLAYER_STORAGE_KEY,JSON.stringify(this.config))
    },
    render: function(){
        const htmls = this.songs.map((song, index) => {
            return `<div class="song ${index === this.currentIndex ? 'active' : ''}" data-index = "${index}">
            <div class="thumb" style="background-image: url('${song.image}">
            </div>
            <div class="body">
              <h3 class="title">${song.name}</h3>
              <p class="author">${song.singer}</p>
            </div>
            <div class="option">
              <i class="fas fa-ellipsis-h"></i>
            </div>
          </div>`
        })
        playList.innerHTML = htmls.join('')
    },
    defineProperties: function(){
        Object.defineProperty(this, 'currentSong',{
            get: function(){
                return this.songs[this.currentIndex];
            }
        })
    },
    handeEvents: function(){
        const cdWidth = cd.offsetWidth
        const _this = this

        // Rote thumb
       const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ],{
            duration: 10000,
            iterations: Infinity,
        })
        cdThumbAnimate.pause()

        document.onscroll = function(){
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newWidth = cdWidth - scrollTop
            cd.style.width = newWidth > 0 ? newWidth + 'px' : 0;

            cd.style.opacity = newWidth / cdWidth
        }

        btnPlay.onclick = function(){
            if(_this.isPlaying){
                audio.pause();
            }
            else
                audio.play();
                
        }

        // When Song Play
        audio.onplay = function(){
            player.classList.add('playing')
            _this.isPlaying = true
            cdThumbAnimate.play()
        }
        // When Song Pause
        audio.onpause = function(){
            player.classList.remove('playing')
            _this.isPlaying = false
            cdThumbAnimate.pause();
        }
        
        // Update progress when audio play
        audio.ontimeupdate = function(){
            if(audio.duration){
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
        }
        // When change progress
        progress.oninput = function(e){
            audio.currentTime = audio.duration / 100 * e.target.value
        }
        // Next song
        btnNext.onclick = function(){
            if(_this.isRandom){
                _this.randomSong()
            }
            else{
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollTopActSong()
        }
        // Prev song
        btnPrev.onclick = function(){
            if(_this.isRandom){
                _this.randomSong()
            }
            else{
                _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.scrollTopActSong()
        }
        // Random
        btnRand.onclick = function(){
            _this.isRandom = !_this.isRandom
            _this.setCofig('isRandom', _this.isRandom)
            this.classList.toggle('active', _this.isRandom)
        }

        btnRepeat.onclick = function(){
            _this.isRepeat = !_this.isRepeat
            _this.setCofig('isRepeat', _this.isRepeat)
            this.classList.toggle('active', _this.isRepeat)
        }

        // When ended song
        audio.onended = function(){
            if(_this.isRepeat){
                audio.play();
            }
            else btnNext.click()
        }

        playList.onclick = function(e){
            const songNode = e.target.closest('.song:not(.active)')
            if( songNode || e.target.closest('.option')){
                // if(e.target.closest('.option')){
                // }
                if(songNode){
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    audio.play()
                    _this.render()
                }
            }
        }
    },
    scrollTopActSong: function() {
        setTimeout(()=> {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            })
        }, 300)
    },
    loadConfig: function(){
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },
    loadCurrentSong: function(){
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url(${this.currentSong.image})`
        audio.src = this.currentSong.path
    },
    // Next song
    nextSong: function(){
        this.currentIndex++
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function(){
        this.currentIndex--
        if(this.currentIndex < 0 ){
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    randomSong: function(){
        let ind;
        do {
            ind = Math.round(Math.random(this.songs.length) * 10)
        } while (this.currentIndex === ind);

        this.currentIndex = ind
        this.loadCurrentSong()
    },
    start: function(){
        this.loadConfig();
        // Dinh nghia cac thuoc tinh cho object
        this.defineProperties()
        // Lang nghe, Su ly su kien
        this.handeEvents();

        // Tai thong tin bai dau tien voi UI
        this.loadCurrentSong()
        // Render playlist
        this.render();

        btnRand.classList.toggle('active', this.isRandom)
        btnRepeat.classList.toggle('active', this.isRepeat)

    },
}
app.start();