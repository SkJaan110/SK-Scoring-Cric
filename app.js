// app.js - Auth + Realtime DB CRUD + robust auth-state navigation
const auth = firebase.auth();
const dbRef = firebase.database().ref();

// ----- AUTH FUNCTIONS -----
function signUp(){
  const email = document.getElementById('signup-email').value.trim();
  const password = document.getElementById('signup-password').value.trim();
  if(!email || !password){ alert('Enter email & password'); return; }
  auth.createUserWithEmailAndPassword(email,password)
    .then(()=>{ location.href='dashboard.html'; })
    .catch(e=>{ alert('Signup error: '+e.message); console.error(e); });
}

function signIn(){
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value.trim();
  if(!email || !password){ alert('Enter email & password'); return; }
  auth.signInWithEmailAndPassword(email,password)
    .then(()=>{ location.href='dashboard.html'; })
    .catch(e=>{ alert('Login error: '+e.message); console.error(e); });
}

function googleLogin(){
  const provider = new firebase.auth.GoogleAuthProvider();
  if(window.matchMedia("(max-width: 800px)").matches){
    auth.signInWithRedirect(provider);
  } else {
    auth.signInWithPopup(provider).catch(e=>console.error('Popup error',e));
  }
}

function logOut(){
  auth.signOut().then(()=>{ location.href='index.html'; });
}

// ----- helper: path for current user -----
function userPath(){
  const u = auth.currentUser;
  return u ? ('users/'+u.uid) : null;
}

// ----- Create / Read: Teams, Players, Tournaments, Matches -----
function createTeamInline(name, logo){
  const path = userPath(); if(!path) { alert('Login required'); return; }
  const ref = dbRef.child(path + '/teams').push();
  return ref.set({ name: name||'Team', logo: logo||'', createdAt: Date.now() });
}
function createPlayerInline(player){
  const path = userPath(); if(!path) { alert('Login required'); return; }
  const ref = dbRef.child(path + '/players').push();
  return ref.set(player);
}
function createTournamentInline(data){
  const path = userPath(); if(!path) { alert('Login required'); return; }
  const ref = dbRef.child(path + '/tournaments').push();
  return ref.set(data);
}
function createMatchInline(data){
  const path = userPath(); if(!path) { alert('Login required'); return; }
  const ref = dbRef.child(path + '/matches').push();
  return ref.set(data);
}

// ----- UI helpers used across pages -----
function populateTeamSelects(){
  const path = userPath(); if(!path) return;
  const a = document.getElementById('m_teamA'); const b = document.getElementById('m_teamB');
  if(a) a.innerHTML = '<option value="">-- select --</option>';
  if(b) b.innerHTML = '<option value="">-- select --</option>';
  dbRef.child(path+'/teams').once('value').then(snap=>{
    snap.forEach(ch=>{
      const t = ch.val();
      const opt = '<option value="'+ch.key+'">'+t.name+'</option>';
      if(a) a.innerHTML += opt;
      if(b) b.innerHTML += opt;
    });
  });
}

// ----- Page-specific loaders (call on load) -----
function loadDashboardMatches(){
  const path = userPath(); if(!path) return;
  const container = document.getElementById('matches-list');
  dbRef.child(path+'/matches').on('value', snap=>{
    if(!container) return;
    container.innerHTML = '';
    if(!snap.exists()){ container.innerHTML='<p class="small">No matches yet</p>'; return; }
    snap.forEach(ch=>{
      const m = ch.val();
      const div = document.createElement('div'); div.className='match-card item-card';
      div.innerHTML = '<b>'+ (m.teamAName||m.teamA) +'</b> vs <b>'+(m.teamBName||m.teamB) +'</b><br>Overs: '+(m.overs||'--')+' • '+(m.status||'upcoming');
      container.appendChild(div);
    });
  });
}

function loadMyLists(){
  const path = userPath(); if(!path) return;
  const tEl = document.getElementById('myTournamentsList');
  if(tEl) dbRef.child(path+'/tournaments').on('value',snap=>{
    tEl.innerHTML='';
    snap.forEach(ch=>{ const t=ch.val(); const d=document.createElement('div'); d.className='item-card'; d.innerHTML='<b>'+t.title+'</b><div class="small">'+t.type+' • '+t.format+'</div>'; tEl.appendChild(d); });
  });
  const teamsEl = document.getElementById('myTeamsList');
  if(teamsEl) dbRef.child(path+'/teams').on('value',snap=>{
    teamsEl.innerHTML='';
    snap.forEach(ch=>{ const tt=ch.val(); const d=document.createElement('div'); d.className='item-card'; d.innerHTML='<b>'+tt.name+'</b>'; teamsEl.appendChild(d); });
  });
  const playersEl = document.getElementById('myPlayersList');
  if(playersEl) dbRef.child(path+'/players').on('value',snap=>{
    playersEl.innerHTML='';
    snap.forEach(ch=>{ const p=ch.val(); const d=document.createElement('div'); d.className='item-card'; d.innerHTML=(p.photo?'<img src="'+p.photo+'" style="width:48px;height:48px;border-radius:50%;margin-right:8px;vertical-align:middle">':'')+'<b>'+p.name+'</b><div class="small">'+(p.role||'')+'</div>'; playersEl.appendChild(d); });
  });
}

// ----- simple form wrappers for pages -----
function pageCreateTeam(e){
  e && e.preventDefault();
  const name = document.getElementById('team_name')?.value?.trim();
  const logo = document.getElementById('team_logo_url')?.value?.trim();
  if(!name){ alert('Team name required'); return; }
  createTeamInline(name, logo).then(()=>{ alert('Team created'); document.getElementById('team_form')?.reset(); });
}

function pageCreatePlayer(e){
  e && e.preventDefault();
  const p = {
    name: document.getElementById('p_name')?.value || '',
    role: document.getElementById('p_role')?.value || '',
    batHand: document.getElementById('p_bathand')?.value || '',
    battingType: document.getElementById('p_battingtype')?.value || '',
    bowlHand: document.getElementById('p_bowlhand')?.value || '',
    bowlingType: document.getElementById('p_bowlingtype')?.value || '',
    photo: document.getElementById('p_photo_url')?.value || ''
  };
  if(!p.name){ alert('Player name required'); return; }
  createPlayerInline(p).then(()=>{ alert('Player created'); document.getElementById('player_form')?.reset(); });
}

function pageCreateTournament(e){
  e && e.preventDefault();
  const data = {
    title: document.getElementById('t_title')?.value || '',
    type: document.getElementById('t_type')?.value || '',
    format: document.getElementById('t_format')?.value || '',
    overs: parseInt(document.getElementById('t_overs')?.value) || 0,
    city: document.getElementById('t_city')?.value || '',
    ball: document.getElementById('t_ball')?.value || '',
    organiser: document.getElementById('t_org')?.value || ''
  };
  if(!data.title){ alert('Title required'); return; }
  createTournamentInline(data).then(()=>{ alert('Tournament created'); document.getElementById('t_form')?.reset(); });
}

function pageCreateMatch(e){
  e && e.preventDefault();
  const teamAKey = document.getElementById('m_teamA')?.value;
  const teamBKey = document.getElementById('m_teamB')?.value;
  const overs = parseInt(document.getElementById('m_overs')?.value) || 0;
  if(!teamAKey || !teamBKey){ alert('Select both teams'); return; }
  const path = userPath();
  dbRef.child(path + '/teams/' + teamAKey).once('value').then(snapA=>{
    dbRef.child(path + '/teams/' + teamBKey).once('value').then(snapB=>{
      const data = { teamA: teamAKey, teamB: teamBKey, teamAName: snapA.val().name, teamBName: snapB.val().name, overs, status:'upcoming' };
      createMatchInline(data).then(()=>{ alert('Match created'); document.getElementById('match_form')?.reset(); });
    });
  });
}

// ----- auth state control: don't force redirect away from internal pages -----
auth.onAuthStateChanged(user=>{
  const page = window.location.pathname;
  if(!user){
    if(!page.includes('index.html')) location.href='index.html';
  } else {
    if(page.endsWith('index.html') || page.endsWith('/')) location.href='dashboard.html';
    setTimeout(()=>{
      if(page.includes('dashboard.html')) loadDashboardMatches();
      if(page.includes('createMatch.html')) populateTeamSelects();
      if(page.includes('myTeams.html') || page.includes('myPlayers.html') || page.includes('myTournament.html') || page.includes('profile.html')) loadMyLists();
      // profile fields
      if(page.includes('profile.html')){
        document.getElementById('userName') && (document.getElementById('userName').innerText = user.displayName || user.email || 'No name');
        document.getElementById('userEmail') && (document.getElementById('userEmail').innerText = user.email || '');
      }
    }, 300);
  }
});