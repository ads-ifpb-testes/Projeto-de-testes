const createPostButton = document.querySelector('.create-post-btn');
const createPostModal = document.querySelector('.create-post-modal');
const closeCPMBtn = document.querySelector('.close-modal-over');
const editProfileBtn = document.querySelector('.edit-profile-btn');
const cancelEditProfileBtn = document.querySelector('.ep-cancel');
const editProfileModal = document.querySelector('.edit-profile');
const deleteProfile = document.querySelector('.delete-profile-form');
const deletePost = document.querySelector('.delete-post-form');

document.addEventListener('click', e => {
  let el = e.target;
  if (el === createPostButton) {
    if (createPostModal.classList.contains('hidden')) {
      createPostModal.classList.remove('hidden');
    }
  }

  if (el === closeCPMBtn || el === createPostModal) {
    if (!createPostModal.classList.contains('hidden')) {
      createPostModal.classList.add('hidden');
    }
  }

  if (el === editProfileBtn) {
    if (editProfileModal.classList.contains('hidden')) {
      editProfileModal.classList.remove('hidden');
    }
  }

  if (el === cancelEditProfileBtn || el === editProfileModal) {
    if (!editProfileModal.classList.contains('hidden')) {
      editProfileModal.classList.add('hidden');
    }
  }

  if (el.classList.contains('show-comments')) {
    let comments = el.parentNode.children[1];
    if (comments.classList.contains('hidden'))
      el.innerText = 'Ocultar comentários';
    else el.innerText = 'Mostrar comentários';

    comments.classList.toggle('hidden');
  }

  if (el === deletePost) {
    if (!deleteModal.classList.contains('hidden'))
    deleteModal.classList.add('hidden');
  }
});

if (deleteProfile) deleteProfile.addEventListener('submit', e => {
  e.preventDefault();
  let text = 'Seu perfil será excluído para sempre (muito tempo)!\nTem certeza que deseja deletar?';
  if (confirm(text)) e.target.submit();
});

if (deleteProfile) deletePost.addEventListener('submit', e => {
  e.preventDefault();
  let text = 'Seu post será excluído para sempre (muito tempo)!\nTem certeza que deseja deletar?';
  if (confirm(text)) e.target.submit();
});

const searchBar = document.getElementById('people-search');
const peopleList = document.getElementsByClassName('pr-result');

searchBar.addEventListener('keyup', e => {
  const text = e.target.value.toLowerCase();
  [...peopleList].forEach(user =>
    user.querySelector('.pr-username').textContent.toLowerCase().startsWith(text)
      ? user.classList.remove('hidden')
      : user.classList.add('hidden')
  );
});