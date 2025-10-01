// app.js - Auth + basic CRUD for Realtime Database
const auth = firebase.auth();
const dbRef = firebase.database().ref();

// -------- AUTH: SignUp / SignIn / Google --------
function signUp(){
  const email = document.getElementById('signup-email').value.trim();
  const password = document.getElementById('signup-password').value.trim();
  if(!email || !password){ alert('Enter email & password'); return; }
  auth.createUserWithEmailAndPassword(email,password)
    .then(u=>{ alert('Signup successful'); location.href='dashboard.html'; })
    .catch(e=>{ alert('Signup error: '+e.message); console.error(e); });
}

function signIn(){
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value.trim();
  if(!email || !password){ alert('Enter email & password'); return; }
  auth.signInWithEmailAndPassword(email,password)
    .then(u=>{ alert('Login successful'); location.href='dashboard.html'; })
    .catch(e=>{ alert('Login error: '+e.message); console.error(e); });
}

function googleLogin(){
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithRedirect(provider);
}

// handle redirect result
auth.getRedirectResult().then(result=>{
  if(result && result.user){
    location.href='dashboard.html';
  }
}).catch(e=>{
  console.log('Redirect error', e);
});

// redirect if already logged in
auth.onAuthStateChanged(user=>{
  if(user && (location.pathname.endsWith('index.html') || location.pathname.endsWith('/'))){
    location.href='dashboard.html';
  }
});

// -------- Helpers: current user path --------
function uidPath(){ const u = auth.currentUser; return u ? ('users/'+u.uid) : null; }

// -------- TOURNAMENTS CRUD --------
function createTournament(e){
  e && e.preventDefault();
  const path = uidPath(); if(!path){ alert('Login first'); location.href='index.html'; return; }
  const data = {
    title: document.getElementById('t_title').value || '',
    type: document.getElementById('t_type').value || '',
    format: document.getElementById('t_format').value || '',
    overs: parseInt(document.getElementById('t_overs').value) || 0,
    city: document.getElementById('t_city').value || '',
    ball: document.getElementById('t_ball').value || '',
    organiser: document.getElementById('t_org').value || '',
    createdAt: Date.now()
  };
  const newRef = dbRef.child(path+'/tournaments').push();
  newRef.set(data).then(()=>{ alert('Tournament saved'); document.getElementById('t_form').reset(); });
}

// -------- TEAMS CRUD --------
function createTeam(e){
  e && e.preventDefault();
  const path = uidPath(); if(!path){ alert('Login first'); location.href='index.html'; return; }
  const teamName = document.getElementById('team_name').value || '';
  const teamLogo = document.getElementById('team_logo_url').value || '';
  const newRef = dbRef.child(path+'/teams').push();
  newRef.set({ name: teamName, logo: teamLogo, createdAt: Date.now() })
    .then(()=>{ alert('Team saved'); document.getElementById('team_form').reset(); });
}

// -------- PLAYERS CRUD --------
function createPlayer(e){
  e && e.preventDefault();
  const path = uidPath(); if(!path){ alert('Login first'); location.href='index.html'; return; }
  const player = {
    name: document.getElementById('p_name').value || '',
    role: document.getElementById('p_role').value || '',
    batHand: document.getElementById('p_bathand').value || '',
    battingType: document.getElementById('p_battingtype').value || '',
    bowlHand: document.getElementById('p_bowlhand').value || '',
    bowlingType: document.getElementById('p_bowlingtype').value || '',
    photo: document.getElementById('p_photo_url').value || ''
  };
  const newRef = dbRef.child(path+'/players').push();
  newRef.set(player).then(()=>{ alert('Player saved'); document.getElementById('player_form').reset(); });
}

// -------- MATCHES CRUD --------
function createMatch(e){
  e && e.preventDefault();
  const path = uidPath(); if(!path){ alert('Login first'); location.href='index.html'; return; }
  const match = {
    teamA: document.getElementById('m_teamA').value || '',
    teamB: document.getElementById('m_teamB').value || '',
    overs: parseInt(document.getElementById('m_overs').value) || 0,
    status: 'upcoming',
    createdAt: Date.now()
  };
  const newRef = dbRef.child(path+'/matches').push();
  newRef.set(match).then(()=>{ alert('Match saved'); document.getElementById('match_form').reset(); });
}

// -------- UI helpers to populate selects --------
function populateTeamSelects(){
  const path = uidPath();
  if(!path) return;
  const tA = document.getElementById('m_teamA');
  const tB = document.getElementById('m_teamB');
  if(tA) tA.innerHTML = '<option value="">-- select --</option>';
  if(tB) tB.innerHTML = '<option value="">-- select --</option>';
  dbRef.child(path+'/teams').once('value').then(snap=>{
    snap.forEach(child=>{
      const t = child.val();
      const opt = '<option value="'+t.name+'">'+t.name+'</option>';
      if(tA) tA.innerHTML += opt;
      if(tB) tB.innerHTML += opt;
    });
  });
}

// -------- PROFILE / MY LISTS loader --------
function loadMyData(){
  const path = uidPath(); if(!path){ location.href='index.html'; return; }
  dbRef.child(path+'/tournaments').on('value', snap=>{
    const el = document.getElementById('myTournamentsList'); if(!el) return;
    el.innerHTML = '';
    snap.forEach(ch=>{ const t = ch.val(); const div=document.createElement('div'); div.className='card small'; div.innerText = t.title+' ('+t.type+')'; el.appendChild(div); });
  });
  dbRef.child(path+'/teams').on('value', snap=>{
    const el = document.getElementById('myTeamsList'); if(!el) return;
    el.innerHTML = '';
    snap.forEach(ch=>{ const tt = ch.val(); const div=document.createElement('div'); div.className='card small'; div.innerText = tt.name; el.appendChild(div); });
  });
  dbRef.child(path+'/players').on('value', snap=>{
    const el = document.getElementById('myPlayersList'); if(!el) return;
    el.innerHTML = '';
    snap.forEach(ch=>{ const p = ch.val(); const div=document.createElement('div'); div.className='player-card'; div.innerHTML = (p.photo?'<img src="'+p.photo+'" class="player-photo">':'')+'<div class="player-info"><div class="player-name">'+p.name+'</div><div class="player-role">'+p.role+'</div></div>'; el.appendChild(div); });
  });
}

window.addEventListener('load', ()=>{
  if(document.getElementById('m_teamA')) populateTeamSelects();
  if(document.getElementById('myTournamentsList')) loadMyData();
});
