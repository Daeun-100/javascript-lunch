var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var _restaurantList, _currentCategory, _nameOrDistance, _value, _Restaurant_instances, validate_fn;
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
const $ = (selector, parent = document) => parent.querySelector(selector);
const setAttributes = (element, attributes) => {
  Object.entries(attributes).forEach(([key, value]) => {
    if (value || value === "") element.setAttribute(key, value);
  });
};
const setChildren = (element, children) => {
  element.append(...Array.from(children).filter(Boolean));
};
const setClasses = (element, classNames) => {
  if (!classNames || classNames.length === 0) return;
  if (typeof classNames === "string") {
    classNames = classNames.split(" ");
  }
  element.classList.add(...classNames.filter((className) => className));
};
const setEvents = (element, events) => {
  Object.entries(events).forEach(([eventType, handler]) => {
    element.addEventListener(eventType, handler);
  });
};
const setText = (element, text) => {
  if (text) {
    element.textContent = text;
  }
};
const createElement = ({
  tagName,
  classNames = [],
  text = "",
  attributes = {},
  events = {},
  children = []
}) => {
  const element = document.createElement(tagName);
  setClasses(element, classNames);
  setText(element, text);
  setAttributes(element, attributes);
  setEvents(element, events);
  setChildren(element, children);
  return element;
};
const Title = (text, tagName, ...className) => createElement({
  tagName,
  classNames: [...className],
  text
});
const Image = ({ src, alt, classNames }) => createElement({
  tagName: "img",
  attributes: { src, alt },
  classNames
});
const RegisterIcon = () => createElement({
  tagName: "button",
  classNames: ["gnb__button"],
  events: {
    click: () => {
      $("#register-modal-backdrop").classList.add("open");
    }
  },
  children: [Image({ src: "./add-button.png", alt: "음식점 추가" })]
});
const header = () => createElement({
  tagName: "header",
  classNames: ["gnb"],
  children: [
    Title("점심 뭐 먹지", "h1", "gnb__title", "text-title"),
    RegisterIcon()
  ]
});
const BackDrop = (handleClickBackDrop, id) => createElement({
  tagName: "div",
  classNames: ["modal-backdrop"],
  attributes: {
    id
  },
  events: {
    click: handleClickBackDrop
  }
});
const ModalContent = (contents, classNames = []) => createElement({
  tagName: "div",
  classNames: ["modal-container", ...classNames],
  events: {
    click: (e) => e.stopPropagation()
  },
  children: [...contents]
});
const Modal = ({ handleClickBackDrop, id, classNames, contents = [] }) => {
  const backDrop = BackDrop(handleClickBackDrop, id);
  backDrop.appendChild(ModalContent(contents, classNames));
  return backDrop;
};
const FOOD_CATEGORY = {
  한식: "korean",
  중식: "chinese",
  일식: "japanese",
  아시안: "asian",
  양식: "western",
  기타: "etc"
};
const WALK_TIME_MINUTES = {
  FIVE: 5,
  TEN: 10,
  FIFTEEN: 15,
  TWENTY: 20,
  THIRTY: 30
};
class RestaurantList {
  constructor(restaurantList = []) {
    __privateAdd(this, _restaurantList, []);
    __privateAdd(this, _currentCategory, "");
    __privateAdd(this, _nameOrDistance, "");
    __privateSet(this, _restaurantList, restaurantList);
  }
  add(restaurant) {
    __privateGet(this, _restaurantList).push(restaurant);
  }
  delete(restaurant) {
    __privateSet(this, _restaurantList, __privateGet(this, _restaurantList).filter(
      (item) => item !== restaurant
    ));
  }
  filter() {
    let filteredList = __privateGet(this, _restaurantList);
    filteredList = this.filterByCategory(__privateGet(this, _currentCategory), filteredList);
    if (__privateGet(this, _nameOrDistance) === "name") {
      return this.filterByName(filteredList);
    }
    if (__privateGet(this, _nameOrDistance) === "distance") {
      return this.filterByDistance(filteredList);
    }
    return filteredList;
  }
  getFavoriteList() {
    const favoriteList = __privateGet(this, _restaurantList).filter(
      (restaurant) => restaurant.value.isFavorite
    );
    return favoriteList;
  }
  filterByCategory(category, list) {
    if (category === "") {
      return list;
    }
    return list.filter((restaurant) => restaurant.value.category === category);
  }
  filterByName(list) {
    return [...list].sort((a, b) => a.value.name.localeCompare(b.value.name));
  }
  filterByDistance(list) {
    return [...list].sort((a, b) => a.value.distance - b.value.distance);
  }
  setCategory(category) {
    __privateSet(this, _currentCategory, category);
  }
  setNameOrDistance(sortBy) {
    __privateSet(this, _nameOrDistance, sortBy);
  }
  get value() {
    return [...__privateGet(this, _restaurantList)];
  }
}
_restaurantList = new WeakMap();
_currentCategory = new WeakMap();
_nameOrDistance = new WeakMap();
const createKeyValuePair = (keys, values) => {
  if (keys.length !== values.length) return;
  return keys.reduce((obj, key, index) => {
    obj[key] = values[index];
    return obj;
  }, {});
};
const Input = (name, required = false) => createElement({
  tagName: "input",
  attributes: {
    type: "text",
    name,
    id: name,
    required
  }
});
const Select = ({ name, required, options, defaultOptionText, events }) => {
  const defaultOption = createElement({
    tagName: "option",
    attributes: { value: "" },
    text: defaultOptionText
  });
  const optionsElement = Object.entries(options).map(
    ([key, value]) => createElement({
      tagName: "option",
      attributes: { value: key },
      text: value
    })
  );
  const select = createElement({
    tagName: "select",
    attributes: { name, id: name, required },
    children: [defaultOption, ...optionsElement],
    events
  });
  return select;
};
const TextArea = (name, required = false) => createElement({
  tagName: "textarea",
  attributes: { type: "text", name, id: name, required }
});
const SELECT_PLACEHOLDER = "선택해주세요.";
const createFormElementByType = ({
  inputType,
  infoType,
  required,
  options
}) => {
  if (inputType === "input") return Input(infoType, required);
  if (inputType === "select")
    return Select({
      name: infoType,
      required,
      options,
      defaultOptionText: SELECT_PLACEHOLDER
    });
  if (inputType === "textarea") return TextArea(infoType, required);
};
const HelpText = (text) => createElement({
  tagName: "span",
  classNames: ["help-text", "text-caption"],
  text
});
const LABEL_TEXT = {
  category: "카테고리",
  name: "이름",
  distance: "거리(도보 이동 시간)",
  description: "설명",
  link: "참고 링크"
};
const Label = (infoType) => createElement({
  tagName: "label",
  attributes: { for: infoType },
  classNames: ["text-caption"],
  text: LABEL_TEXT[infoType]
});
const INPUT_HELP_TEXT = {
  DESCRIPTION: "메뉴 등 추가 정보를 입력해 주세요.",
  LINK: "매장 정보를 확인할 수 있는 링크를 입력해 주세요."
};
const InputField = ({ inputType, infoType, required, options }) => {
  const formElement = createFormElementByType({
    inputType,
    infoType,
    required,
    options
  });
  const inputField = createElement({
    tagName: "div",
    classNames: ["form-item", required ? "form-item--required" : ""],
    attributes: { id: `${infoType}-form-item` },
    children: [
      Label(infoType),
      formElement,
      INPUT_HELP_TEXT[infoType.toUpperCase()] && HelpText(INPUT_HELP_TEXT[infoType.toUpperCase()])
    ]
  });
  return inputField;
};
const ERROR_MESSAGE = {
  CATEGORY_FIELD_REQUIRED: "카테고리를 선택해주세요.",
  NAME_FIELD_REQUIRED: "이름을 입력해주세요.",
  DISTANCE_FIELD_REQUIRED: "거리를 선택해주세요."
};
const validateEmpty = (string, message) => {
  if (string === "") throw new Error(message);
};
class Restaurant {
  constructor({
    category,
    name,
    distance,
    description,
    link,
    isFavorite = false
  }) {
    __privateAdd(this, _Restaurant_instances);
    __privateAdd(this, _value);
    __privateSet(this, _value, { category, name, distance, description, link, isFavorite });
    __privateMethod(this, _Restaurant_instances, validate_fn).call(this);
  }
  toggleFavorite() {
    __privateGet(this, _value).isFavorite = !__privateGet(this, _value).isFavorite;
  }
  get value() {
    return {
      ...__privateGet(this, _value)
    };
  }
}
_value = new WeakMap();
_Restaurant_instances = new WeakSet();
validate_fn = function() {
  validateEmpty(__privateGet(this, _value).category, ERROR_MESSAGE.CATEGORY_FIELD_REQUIRED);
  validateEmpty(__privateGet(this, _value).name, ERROR_MESSAGE.NAME_FIELD_REQUIRED);
  validateEmpty(__privateGet(this, _value).distance, ERROR_MESSAGE.DISTANCE_FIELD_REQUIRED);
};
const clearError = (selector = ".error-message") => {
  var _a;
  (_a = document.querySelectorAll(selector)) == null ? void 0 : _a.forEach((el) => el.remove());
};
const clearInput = (formSelector) => {
  $(formSelector).reset();
};
const isEmpty = (string) => {
  return string === "";
};
const isValidStringLength = (str, { min, max }) => {
  return str.length >= min && str.length <= max;
};
const getInfo = () => {
  const form = $("#register-form");
  const formData = new FormData(form);
  const info = Object.fromEntries(formData.entries());
  clearError();
  return validateInfo(info);
};
const validateInfo = (info) => {
  if (isEmpty(info.category)) {
    throw new Error(ERROR_MESSAGE.CATEGORY_FIELD_REQUIRED, {
      cause: "category"
    });
  }
  if (isEmpty(info.name)) {
    throw new Error(ERROR_MESSAGE.NAME_FIELD_REQUIRED, { cause: "name" });
  }
  if (!isValidStringLength(info.name, { min: 1, max: 20 })) {
    throw new Error(ERROR_MESSAGE.NAME_LENGTH, { cause: "name" });
  }
  if (isEmpty(info.distance)) {
    throw new Error(ERROR_MESSAGE.DISTANCE_FIELD_REQUIRED, {
      cause: "distance"
    });
  }
  if (!isValidStringLength(info.description, { min: 0, max: 500 })) {
    throw new Error(ERROR_MESSAGE.DESCRIPTION_LENGTH, { cause: "description" });
  }
  return info;
};
const Button = ({ text, style, onClick, type = "submit", id }) => createElement({
  tagName: "button",
  text,
  classNames: ["button", "text-caption", style],
  attributes: { type, id },
  events: { click: onClick }
});
const ErrorMessage = (message) => createElement({
  tagName: "p",
  classNames: ["error-message", "text-caption"],
  text: message
});
const storage = {
  saveRestaurantList(value) {
    const restaurantListValue = value.map((restaurant) => {
      return restaurant.value;
    });
    localStorage.setItem("restaurnatList", JSON.stringify(restaurantListValue));
  },
  loadRestaurantList() {
    const restaurantList = localStorage.getItem("restaurnatList");
    return restaurantList ? JSON.parse(restaurantList) : null;
  },
  saveCategory(value) {
    localStorage.setItem("category", JSON.stringify(value));
  },
  loadCategory() {
    const category = localStorage.getItem("category");
    return category ? JSON.parse(category) : null;
  },
  saveNameOrDistance(value) {
    localStorage.setItem("nameOrDistance", JSON.stringify(value));
  },
  loadNameOrDistance() {
    const nameOrDistance = localStorage.getItem("nameOrDistance");
    return nameOrDistance ? JSON.parse(nameOrDistance) : null;
  },
  saveTabInfo(value) {
    localStorage.setItem("TabInfo", JSON.stringify(value));
  },
  loadTabInfo() {
    const tabInfo = localStorage.getItem("TabInfo");
    return tabInfo ? JSON.parse(tabInfo) : null;
  }
};
const Description = (text) => createElement({
  tagName: "p",
  classNames: ["restaurant__description", "text-body"],
  text
});
const Distance = (minute) => createElement({
  tagName: "span",
  classNames: ["restaurant__distance", "text-body"],
  text: `캠퍼스부터 ${minute}분 내`
});
const Link = (link) => createElement({
  tagName: "p",
  classNames: ["restaurant__link"],
  text: `${link}`
});
const RestaurantInfo = ({ name, distance, description, link }) => createElement({
  tagName: "div",
  classNames: ["restaurant__info"],
  children: [
    Title(name, "h3", "restaurant__name", "text-subtitle"),
    Distance(distance),
    Description(description),
    Link(link)
  ]
});
const CategoryImage = (category) => createElement({
  tagName: "div",
  classNames: ["restaurant__category"],
  children: [
    Image({
      src: `./category-${FOOD_CATEGORY[category]}.png`,
      alt: category,
      classNames: ["category-icon"]
    })
  ]
});
const FavoriteIcon = (restaurant, clickFavorite) => createElement({
  tagName: "div",
  classNames: ["restaurant__favorite"],
  children: [
    Image({
      src: restaurant.value.isFavorite ? "./favorite-icon-filled.png" : "./favorite-icon-lined.png",
      alt: "favorite-icon",
      classNames: ["favorite-icon"]
    })
  ],
  events: {
    click: (e) => {
      e.stopPropagation();
      restaurant.toggleFavorite();
      e.target.src = restaurant.value.isFavorite ? "./favorite-icon-filled.png" : "./favorite-icon-lined.png";
      clickFavorite && clickFavorite();
    }
  }
});
const RestaurantCard = (restaurant, events = {}) => {
  const { category } = restaurant.value;
  const { clickFavorite, clickCard } = events;
  const restaurantCard = createElement({
    tagName: "li",
    classNames: ["restaurant"],
    children: [
      CategoryImage(category),
      RestaurantInfo(restaurant.value),
      FavoriteIcon(restaurant, clickFavorite)
    ],
    events: {
      click: () => {
        clickCard(restaurant);
      }
    }
  });
  return restaurantCard;
};
const BUTTON_TEXT$1 = {
  DELETE: "삭제하기",
  CLOSE: "닫기"
};
const RestaurantDetailButtonContainer = (restaurant, clickDelete2) => {
  const deleteButton = Button({
    text: BUTTON_TEXT$1.DELETE,
    style: "button--secondary",
    id: "delete-button",
    onClick: () => {
      $("#restaurant-detail-modal-backdrop").classList.remove("open");
      clickDelete2();
    }
  });
  const closeButton = Button({
    text: BUTTON_TEXT$1.CLOSE,
    style: "button--primary",
    id: "close-button",
    onClick: () => {
      $("#restaurant-detail-modal-backdrop").classList.remove("open");
    }
  });
  const buttonContainer = createElement({
    tagName: "div",
    classNames: ["button-container"],
    children: [deleteButton, closeButton]
  });
  return buttonContainer;
};
const clickDelete = (restaurant, restaurantList) => {
  restaurantList.delete(restaurant);
  storage.saveRestaurantList(restaurantList.value);
  renderFilteredRestaurants(restaurantList);
};
const createRestaurantCards = (restaurantList, events = {}) => {
  return restaurantList.map((restaurant) => RestaurantCard(restaurant, events));
};
const renderRestaurants = (restaurantCardList) => {
  const ulTag = $(".restaurant-list");
  ulTag.innerHTML = "";
  restaurantCardList.forEach((restaurantCard) => {
    ulTag.appendChild(restaurantCard);
  });
  return ulTag;
};
const renderFavoritePage = (restaurantList) => {
  $(".restaurant-filter-container").innerHTML = "";
  $(".restaurant-list").innerHTML = "";
  const favoriteCardList = createRestaurantCards(
    restaurantList.getFavoriteList(),
    {
      clickFavorite: () => {
        storage.saveRestaurantList(restaurantList.value);
        renderFavoritePage(restaurantList);
      }
    }
  );
  return renderRestaurants(favoriteCardList);
};
const eventHandlers = {
  filtered(restaurantList) {
    return {
      clickCard: (restaurant) => {
        $("#restaurant-detail-modal-backdrop").classList.add("open");
        changeModalContents(restaurant, restaurantList);
      },
      clickFavorite: () => {
        storage.saveRestaurantList(restaurantList.value);
        renderFilteredRestaurants(restaurantList);
      }
    };
  },
  favorite(restaurantList) {
    return {
      clickFavorite: () => {
        storage.saveRestaurantList(restaurantList.value);
        renderFavoritePage(restaurantList);
      }
    };
  }
};
const changeModalContents = (restaurant, restaurantList) => {
  const restaurantDetailModal = $(".restaurant-detail-modal");
  restaurantDetailModal.innerHTML = "";
  restaurantDetailModal.appendChild(
    RestaurantCard(restaurant, eventHandlers.favorite(restaurantList))
  );
  restaurantDetailModal.appendChild(
    RestaurantDetailButtonContainer(restaurant, () => {
      clickDelete(restaurant, restaurantList);
    })
  );
  return restaurantDetailModal;
};
const renderFilteredRestaurants = (restaurantList) => {
  const filteredCardList = createRestaurantCards(
    restaurantList.filter(),
    eventHandlers.filtered(restaurantList)
  );
  return renderRestaurants(filteredCardList);
};
const RegisterButtonContainer = (restaurantList) => {
  const cancelButton = Button({
    text: BUTTON_TEXT.CANCEL,
    style: "button--secondary",
    onClick: closeModal,
    type: "button",
    id: "cancel-button"
  });
  const addButton = Button({
    text: BUTTON_TEXT.ADD,
    style: "button--primary",
    onClick: (e) => registerRestaurant(e, restaurantList),
    id: "register-button"
  });
  const buttonContainer = createElement({
    tagName: "div",
    classNames: ["button-container"],
    children: [cancelButton, addButton]
  });
  return buttonContainer;
};
const BUTTON_TEXT = {
  CANCEL: "취소하기",
  ADD: "추가하기"
};
const closeModal = () => {
  $("#register-modal-backdrop").classList.remove("open");
  clearInput("#register-form");
  clearError();
};
const registerRestaurant = (e, restaurantList) => {
  e.preventDefault();
  try {
    const info = getInfo();
    const restaurant = new Restaurant(info);
    restaurantList.add(restaurant);
    storage.saveRestaurantList(restaurantList.value);
    $("#register-modal-backdrop").classList.remove("open");
    renderFilteredRestaurants(restaurantList);
    clearInput("#register-form");
  } catch (e2) {
    console.log(e2.message);
    const currentInputField = $(`#${e2.cause}-form-item`);
    currentInputField.appendChild(ErrorMessage(e2.message));
  }
};
const RegisterForm = (restaurantList) => {
  const foodCategoryField = InputField({
    inputType: "select",
    infoType: "category",
    required: true,
    options: createKeyValuePair(
      Object.keys(FOOD_CATEGORY),
      Object.keys(FOOD_CATEGORY)
    )
  });
  const distanceField = InputField({
    inputType: "select",
    infoType: "distance",
    required: true,
    options: createKeyValuePair(
      Object.values(WALK_TIME_MINUTES),
      Object.values(WALK_TIME_MINUTES).map((minute) => minute + "분 내")
    )
  });
  const registerForm = createElement({
    tagName: "form",
    attributes: { id: "register-form" },
    children: [
      foodCategoryField,
      InputField({ inputType: "input", infoType: "name", required: true }),
      distanceField,
      InputField({
        inputType: "textarea",
        infoType: "description"
      }),
      InputField({
        inputType: "input",
        infoType: "link"
      }),
      RegisterButtonContainer(restaurantList)
    ]
  });
  return registerForm;
};
const modalClose = (selector) => {
  $(selector).classList.remove("open");
};
const CategorySelector = (restaurantList) => {
  const events = {
    change: (e) => {
      storage.saveCategory(e.target.value);
      restaurantList.setCategory(e.target.value);
      renderFilteredRestaurants(restaurantList);
    }
  };
  return Select({
    name: "category-sorting",
    required: false,
    options: createKeyValuePair(
      Object.keys(FOOD_CATEGORY),
      Object.keys(FOOD_CATEGORY)
    ),
    defaultOptionText: "전체",
    events
  });
};
const NameOrDistanceSelector = (restaurantList) => {
  const events = {
    change: (e) => {
      storage.saveNameOrDistance(e.target.value);
      restaurantList.setNameOrDistance(e.target.value);
      renderFilteredRestaurants(restaurantList);
    }
  };
  return Select({
    name: "sorting",
    required: false,
    options: createKeyValuePair(["name", "distance"], ["이름순", "거리순"]),
    defaultOptionText: "전체",
    events
  });
};
const renderAllpage = (restaurantList) => {
  $(".restaurant-filter-container").innerHTML = "";
  $(".restaurant-list").innerHTML = "";
  const filterContainer = $(".restaurant-filter-container");
  filterContainer.appendChild(CategorySelector(restaurantList));
  filterContainer.appendChild(NameOrDistanceSelector(restaurantList));
  return renderFilteredRestaurants(restaurantList);
};
const TabItem = ({ text, selected, classNames, events }) => {
  return createElement({
    tagName: "div",
    text,
    classNames: [...classNames, selected ? "tab--selected" : ""],
    events
  });
};
const Tab = (restaurantList) => {
  const allTab = TabItem({
    text: "모든 음식점",
    selected: true,
    classNames: ["tab__item--all"],
    events: {
      click: (e) => {
        storage.saveTabInfo("all");
        $(".tab--selected").classList.remove("tab--selected");
        e.target.classList.add("tab--selected");
        renderAllpage(restaurantList);
        $("#category-sorting").value = storage.loadCategory();
        $("#sorting").value = storage.loadNameOrDistance();
      }
    }
  });
  const favoritesTab = TabItem({
    text: "자주 가는 음식점",
    selected: false,
    classNames: ["tab__item--favorites"],
    events: {
      click: (e) => {
        storage.saveTabInfo("favorites");
        $(".tab--selected").classList.remove("tab--selected");
        e.target.classList.add("tab--selected");
        renderFavoritePage(restaurantList);
      }
    }
  });
  const tab = createElement({
    tagName: "section",
    classNames: ["tab"],
    children: [allTab, favoritesTab]
  });
  return tab;
};
const restaurants = [
  new Restaurant({
    category: "한식",
    name: "피양콩할마니",
    distance: WALK_TIME_MINUTES.FIVE,
    description: "평양 출신의 할머니가 수십 년간 운영해온 비지 전문점 피양콩 할마니. 두부를 빼지 않은 되비지를 맛볼 수 있는 곳으로, ‘피양’은 평안도 사투리로 ‘평양’을 의미한다. 딸과 함께 운영하는 이곳에선 맷돌로 직접 간 콩만을 사용하며, 일체의 조미료를 넣지 않은 건강식을 선보인다. 콩비지와 피양 만두가 이곳의 대표 메뉴지만, 할머니가 옛날 방식을 고수하며 만들어내는 비지전골 또한 이 집의 역사를 느낄 수 있는 특별한 메뉴다. 반찬은 손님들이 먹고 싶은 만큼 덜어 먹을 수 있게 준비돼 있다.",
    link: "http//localhost:30000",
    isFavorite: true
  }),
  new Restaurant({
    category: "일식",
    name: "잇쇼우",
    distance: WALK_TIME_MINUTES.FIFTEEN,
    description: "설명입니다",
    link: "http//localhost:30000"
  }),
  new Restaurant({
    category: "중식",
    name: "친친",
    distance: WALK_TIME_MINUTES.TEN,
    description: "설명입니다",
    link: "http//localhost:30000"
  }),
  new Restaurant({
    category: "중식",
    name: "짜짜루루",
    distance: WALK_TIME_MINUTES.FIFTEEN,
    description: "설명입니다",
    link: "http//localhost:30000"
  }),
  new Restaurant({
    category: "중식",
    name: "상화마라탕",
    distance: WALK_TIME_MINUTES.FIVE,
    description: "설명입니다",
    link: "http//localhost:30000"
  })
];
addEventListener("load", () => {
  initStorage();
  const restaurantListData = storage.loadRestaurantList().map((restaurantData) => new Restaurant(restaurantData));
  const category = storage.loadCategory();
  const nameOrDistance = storage.loadNameOrDistance();
  const restaurantList = new RestaurantList(restaurantListData);
  restaurantList.setCategory(category);
  restaurantList.setNameOrDistance(nameOrDistance);
  const app = $("#app");
  app.prepend(header());
  $("nav").appendChild(Tab(restaurantList));
  $("main").appendChild(
    Modal({
      handleClickBackDrop: () => {
        modalClose("#register-modal-backdrop");
        clearInput("#register-form");
      },
      id: "register-modal-backdrop",
      classNames: ["register-modal"],
      contents: [
        Title("새로운 음식점", "h2", "modal-title", "text-title"),
        RegisterForm(restaurantList)
      ]
    })
  );
  $("main").appendChild(
    Modal({
      id: "restaurant-detail-modal-backdrop",
      classNames: ["restaurant-detail-modal"],
      handleClickBackDrop: () => {
        modalClose("#restaurant-detail-modal-backdrop");
      }
    })
  );
  if (storage.loadTabInfo() === "favorites") {
    $(".tab__item--favorites").click();
  } else {
    $(".tab__item--all").click();
  }
});
const initStorage = () => {
  if (storage.loadRestaurantList() === null) {
    storage.saveRestaurantList(restaurants);
  }
  if (storage.loadCategory() === null) {
    storage.saveCategory("");
  }
  if (storage.loadNameOrDistance() === null) {
    storage.saveNameOrDistance("");
  }
  if (storage.loadTabInfo() === null) {
    storage.saveTabInfo("all");
  }
};
