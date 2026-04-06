/* Float-label helpers */
function fFocus(id){ document.getElementById(id).classList.add('active'); }
function fBlur(id,inputId){
  document.getElementById(id).classList.remove('active');
  document.getElementById(id).classList.toggle('filled',!!document.getElementById(inputId).value.trim());
}
function fBlurEl(id,el){
  document.getElementById(id).classList.remove('active');
  document.getElementById(id).classList.toggle('filled',!!el.value.trim());
}
function fInput(id,inputId){
  document.getElementById(id).classList.toggle('filled',!!document.getElementById(inputId).value.trim());
}
function fInputEl(id,el){
  document.getElementById(id).classList.toggle('filled',!!el.value.trim());
}

/* Step nav */
function go(id){
  document.querySelectorAll('.step').forEach(s=>s.classList.remove('active','back-anim'));
  document.getElementById(id).classList.add('active');
}
function goBack(id){
  document.querySelectorAll('.step').forEach(s=>s.classList.remove('active','back-anim'));
  const t=document.getElementById(id);
  t.classList.add('active','back-anim');
}

/* Toast */
function toast(msg){
  const el=document.getElementById('toast');
  el.textContent=msg; el.classList.add('on');
  clearTimeout(window._tt);
  window._tt=setTimeout(()=>el.classList.remove('on'),3000);
}

/* Send OTP (Login Flow) */
function sendOTP(btn){
  const cred=document.getElementById('i-cred').value.trim();
  if(!cred){ shake('f-cred'); toast('Please enter your Gmail or Phone Number'); return; }
  btn.classList.add('loading');
  setTimeout(()=>{
    btn.classList.remove('loading');
    const m=cred.includes('@')
      ? cred.replace(/(.{2}).+(@.+)/,'$1****$2')
      : cred.slice(0,2)+'****'+cred.slice(-2);
    document.getElementById('otp-sub').textContent=`OTP sent to ${m}`;
    go('s2'); startTimer();
    document.getElementById('o1').focus();
    toast('OTP sent successfully ✓');
  },1700);
}

/* Sign up (Registration Flow) */
function doSignup(btn){
  const email = document.getElementById('i-email').value.trim();
  const phone = document.getElementById('i-phone').value.trim();
  
  if(!email && !phone) {
    shake('f-email'); shake('f-phone'); 
    toast('Please enter your email or phone number'); 
    return; 
  }

  btn.classList.add('loading');
  
  setTimeout(()=>{ 
    btn.classList.remove('loading'); 
    
    // Mask the contact method for the OTP subtitle
    let contactInfo = email || phone;
    let m = contactInfo.includes('@')
      ? contactInfo.replace(/(.{2}).+(@.+)/,'$1****$2')
      : contactInfo.slice(0,2)+'****'+contactInfo.slice(-2);
      
    document.getElementById('otp-sub').textContent=`OTP sent to ${m}`;
    
    go('s2'); 
    startTimer(); 
    document.getElementById('o1').focus(); 
    toast('Account created! Verify with OTP ✓'); 
  }, 1700);
}

/* Reset Password */
function doReset(btn){
  btn.classList.add('loading');
  setTimeout(()=>{ btn.classList.remove('loading'); goBack('s1'); toast('Reset link sent ✓'); },1500);
}

/* OTP input logic */
function oIn(el,pId,nId){
  el.value=el.value.replace(/\D/g,'');
  el.classList.toggle('has',!!el.value);
  if(el.value&&nId) document.getElementById(nId).focus();
  const ids=['o1','o2','o3','o4','o5','o6'];
  if(ids.every(id=>document.getElementById(id).value))
    setTimeout(()=>verifyOTP(document.getElementById('b-verify')),280);
}
function oKey(e,pId,curId){
  if(e.key==='Backspace'){
    const cur=document.getElementById(curId);
    if(!cur.value&&pId){
      const p=document.getElementById(pId);
      p.value=''; p.classList.remove('has'); p.focus();
    }
  }
}

/* Verify OTP common */
function verifyOTP(btn){
  const otp=['o1','o2','o3','o4','o5','o6'].map(id=>document.getElementById(id).value).join('');
  if(otp.length<6){ toast('Please complete the 6-digit OTP'); return; }
  btn.classList.add('loading');
  setTimeout(()=>{ btn.classList.remove('loading'); go('s3'); toast('Welcome to Telpha Vastra! 🎉'); },1900);
}

/* Timer */
let _timer;
function startTimer(){
  clearInterval(_timer);
  let s=30;
  const txt=document.getElementById('timer-txt');
  const btn=document.getElementById('resend-btn');
  btn.style.opacity='.35'; btn.style.pointerEvents='none';
  txt.textContent=` (${s}s)`;
  _timer=setInterval(()=>{
    s--;
    if(s<=0){ clearInterval(_timer); txt.textContent=''; btn.style.opacity=''; btn.style.pointerEvents=''; }
    else txt.textContent=` (${s}s)`;
  },1000);
}
function resendOTP(){
  ['o1','o2','o3','o4','o5','o6'].forEach(id=>{ const e=document.getElementById(id); e.value=''; e.classList.remove('has'); });
  document.getElementById('o1').focus();
  startTimer(); toast('OTP resent ✓');
}

/* Social */
function socialLogin(p){ toast(`Connecting with ${p}…`); }

/* Shake animation */
function shake(id){
  document.getElementById(id).animate([
    {transform:'translateX(0)'},{transform:'translateX(-7px)'},
    {transform:'translateX(7px)'},{transform:'translateX(-5px)'},
    {transform:'translateX(5px)'},{transform:'translateX(0)'}
  ],{duration:380,easing:'ease'});
}