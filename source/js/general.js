'use strict';

(function () {
    var menu = document.querySelector('.menu');
    var currentItem;

// удаление класса active у дочерних элементов
  function setSubmenuInactive() {
    var submenuList = currentItem.querySelector('.submenu__list');
    if(submenuList) {
      submenuList.classList.remove('active');
    }
  }

// неактивная иконка
  function setIconInactive(item) {
    var currentIcon = item.querySelector('.fa-chevron-down');
    if(currentIcon) {
      currentIcon.removeAttribute('style');
    }
  }

// неактивная иконка
  function setIconActive(item) {
    var currentIcon = item.querySelector('.fa-chevron-down');
    if(currentIcon) {
      currentIcon.style.transform = 'rotate(180deg)'
    }
  }

// удаление класса active у всех родительских элементов
  function setItemInactive() {
    if (currentItem) {
      setIconInactive(currentItem);
      setSubmenuInactive();
      currentItem.classList.remove('active');
    }
  }

// подставление класса active у элемента
    function setItemActive(item) {
      var submenuList = item.querySelector('.submenu__list');
      item.classList.add('active');
      if (submenuList) {
        submenuList.classList.add('active');
      }
  }

// обработка нажатия на родительский элемент меню
    function onItemClick(evt) {
      var item = evt.target.closest('.menu__item');
      if(item) {
        setItemInactive();
        setIconActive(item);
        setItemActive(item);
        currentItem = item;
      }
    }

    menu.addEventListener('click', onItemClick);
  })();
