<template>
  <footer class="footer-new">
    <div class="overflow">
        <div class="showCont cfff">
            <div class="table w100 mt50 foot_converse">
                <div class="td w50 ">
                    <div class="language_name f26 fleft community" data-lan="community">COOPERATERS</div>
                    <div class="mt10 table w100 f16 foot_converse fleft logolink" >
                        <div class="tr">
                            <div class="td w33 lh45">
                                <a href="https://beechat.io/join?g=7a68c764ffc14a5ba5fcbb12f6fd9f9b&lang=zh" target="_blank" class="ml5 va-m cfff">
                                    <img src="img/footer/beechatnew.png" class="footnew-icon inline va-m"/>
                                    <span>BeeChat</span>
                                </a>
                            </div>
                            <div class="td w33">
                                <a href="https://twitter.com/BTN_top" target="_blank" class="ml5 va-m cfff">
                                    <img src="img/footer/twitternew.png" class="footnew-icon inline va-m"/>
                                    <span>Twitter</span>
                                </a>
                            </div>
                            <div class="td">
                                <a href="https://beechat.io/BitnewChain" target="_blank" class="ml5 va-m cfff">
                                    <img src="img/footer/telegramnew.png" class="footnew-icon inline va-m"/>
                                    <span>Telegram</span>
                                </a>
                            </div>
                        </div>
                        <div class="tr">
                            <div class="td lh45">
                                <a href="https://www.facebook.com/profile.php?id=100023469394969" target="_blank" class="ml5 va-m cfff">
                                    <img src="img/footer/facebooknew.png" class="footnew-icon inline va-m"/>
                                    <span>Facebook</span>
                                </a>
                            </div>
                            <div class="td">
                                <a href="mailto:info@btn.org" class="ml5 va-m cfff">
                                    <img src="img/footer/mailnew.png" class="footnew-icon inline va-m"/>
                                    <span>Email</span>
                                </a>
                            </div>
                            <div class="td lh45">
                                <a href="https://github.com/bitnew-chain/btn_explorer" target="_blank" class="ml5 va-m cfff">
                                    <img src='img/footer/github.png' class="footnew-icon inline va-m"/>
                                    <span>GitHub</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="td w50">
             <div class="language_name f26 fleft foundation" data-lan="foundation" style="">BTN FOUNDATION</div>
                    <div class="language_name mt20 lh26 f16 fleft foundation_desc" data-lan="foundation_desc" style="">BTN Foundation established in Singapore as a nonprofit organization. BTN's vision is building a high-efficiency operating system for decentralized applications developers.</div>
                    <div class="mt40 linktwo">
                        <a href="https://btn.org/download/TermsandConditions.pdf" target="_blank"
                           class="underline cfff">Terms and Conditions</a>
                        <span class="shusort">|</span>
                        <a href="https://btn.org/download/PrivacyPolicy.pdf" target="_blank"
                           class="ml30 underline cfff">Privay Policy</a>
                    </div>
                </div>
            </div>
            <div class="mt20 mb50 ta-c f14">Copyright © 2018 BTN FOUNDATION All rights reserved</div>
        </div>
    </div>
  </footer>
</template>

<style lang="less" scoped>
  footer {
    background-color: #1a191e;
    text-align: center;
    color: white;
  }
  a:link, a:visited, a:hover, a:active {
    color: inherit;
  }
  .line {
    width: 2rem;
    height: 1px;
    margin: 0.5rem auto;
    background-color: white;
  }
  .links {
    display: flex;
    max-width: 40rem;
    margin-left: auto;
    margin-right: auto;
    padding: 0.5rem;
    border-bottom: 1px solid rgba(242, 242, 242, 0.2);
    @media (max-width: 768px) {
      flex-wrap: wrap;
      justify-content: space-around;
      margin-top: 2rem;
      margin-bottom: 2rem;
      > li {
        flex: 50%;
        margin-top: 0.5rem;
        margin-bottom: 0.5rem;
      }
    }
    @media (min-width: 769px) {
      justify-content: space-between;
      margin-top: 2.5rem;
      margin-bottom: 2.5rem;
    }
  }
  @media screen and (min-width: 1300px) {
      .showCont {
          max-width: 1300px;
          width: 1300px;
      }
  }
  .showCont{
      margin:0 auto;
  }

  span.fa, span.btn-icon {
    font-size: 2em;
    vertical-align: middle;
  }
  .foot_converse{
    color: white;
    background-color:  #343646;
  }
  .fleft{
    text-align: left;
    margin-left: 16%;
      font-family: '黑体',PingFangSC-Regular,pingfangsc;
      font-size: 14px;
  }
    body .footer-new{
        background-color: #343646;
    }
    .mb50{
        font-family: '黑体',PingFangSC-Regular,pingfangsc;
        font-size: 12.6px;
    }
    .f16.fleft{
        font-size:13px;
    }
    div[data-lan='foundation_desc']{
        margin-left:-2%;
    }
    div[data-lan='community']{
        margin-left:7.6%;
    }
    .mt10.table.w100.f16.foot_converse{
        margin-left:7%;
    }
  .w33{
      width:20%;
  }
  .language_name.mt20.lh26.f16.fleft.foundation_desc{
      padding-right: 54px;
      word-break: break-all
  }
  .language_name.f26.fleft.foundation{
      margin-left:-2%;
  }
    .community{
        margin-left:20%;
    }
  .mt50{
      margin-top:24px
  }
  .mb50{
      opacity: 0.51;
      margin-bottom:24px
  }
    .logolink .tr .td>a{
        color:#fff;
        font-family: '黑体',PingFangSC-Regular,pingfangsc;
        font-size: 13px;
        opacity:1;
    }
    .foundation_desc{
        opacity: 0.5;
        font-family: '黑体',PingFangSC-Regular,pingfangsc;
    }
    .linktwo{
        margin-left:-2%;
        text-align:left;
        font-size: 13px;
        color: #FFFFFF;
    }
    .shusort{
        color:#3C6CC3;
        margin:0 30px;
    }
    .ml30{
        margin-left:0;
    }
  .mt20{
      margin-top:6px;
  }
  .table{
      margin-bottom:16px;
  }
    .footnew-icon{
        width:34px;
        height: 34px;
    }
    .ml5 img{
        margin-right:8px;
    }
  .underline.cfff{
        opacity: 0.5;
        &:hover{
            opacity:1;
        }
    }
</style>
