var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var _info;
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
const Title = (text, tagName, ...className) => {
  const title = document.createElement(tagName);
  title.classList.add(...className);
  title.textContent = text;
  return title;
};
const Image = (src, alt, className) => {
  const image = document.createElement("img");
  image.setAttribute("src", src);
  image.setAttribute("alt", alt);
  image.classList.add(className);
  return image;
};
const registerIcon = () => {
  const registerIcon2 = document.createElement("button");
  registerIcon2.classList.add("gnb__button");
  registerIcon2.appendChild(Image("./add-button.png", "음식점 추가"));
  registerIcon2.addEventListener("click", () => {
    $(".modal-backdrop").classList.add("open");
  });
  return registerIcon2;
};
const header = () => {
  const header2 = document.createElement("header");
  header2.classList.add("gnb");
  header2.appendChild(Title("점심 뭐 먹지", "h1", "gnb__title", "text-title"));
  header2.appendChild(registerIcon());
  return header2;
};
const BackDrop = (handleCloseModal) => {
  const backDrop = document.createElement("div");
  backDrop.classList.add("modal-backdrop");
  backDrop.addEventListener("click", handleCloseModal);
  return backDrop;
};
const ModalContent = (contents) => {
  const modalContent = document.createElement("div");
  modalContent.addEventListener("click", (e) => e.stopPropagation());
  modalContent.classList.add("modal-container");
  contents.forEach((content) => {
    modalContent.appendChild(content);
  });
  return modalContent;
};
const Modal = (handleCloseModal, ...content) => {
  const backDrop = BackDrop(handleCloseModal);
  backDrop.appendChild(ModalContent(content));
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
const INPUT_HELP_TEXT = {
  SELECT_PLACEHOLDER: "선택해주세요.",
  DESCRIPTION: "메뉴 등 추가 정보를 입력해 주세요.",
  LINK: "매장 정보를 확인할 수 있는 링크를 입력해 주세요."
};
const WALK_TIME_MINUTES = [5, 10, 15, 20, 30];
const createKeyValuePair = (keys, values) => {
  if (keys.length !== values.length) return;
  return keys.reduce((obj, key, index) => {
    obj[key] = values[index];
    return obj;
  }, {});
};
const Input = (name, required = false) => {
  const input = document.createElement("input");
  input.setAttribute("type", "text");
  input.setAttribute("name", name);
  input.setAttribute("id", name);
  input.toggleAttribute("required", required);
  return input;
};
const LABEL_TEXT = {
  category: "카테고리",
  name: "이름",
  distance: "거리(도보 이동 시간)",
  description: "설명",
  link: "참고 링크"
};
const InputField = (inputElement, text) => {
  const infoType = inputElement.id;
  const required = inputElement.required;
  const inputField = document.createElement("div");
  inputField.classList.add("form-item");
  inputField.id = `${infoType}-form-item`;
  if (required) inputField.classList.add("form-item--required");
  const label = document.createElement("label");
  label.setAttribute("for", infoType);
  label.classList.add("text-caption");
  label.textContent = LABEL_TEXT[infoType];
  const helpText = document.createElement("span");
  helpText.classList.add("help-text", "text-caption");
  helpText.textContent = text;
  inputField.appendChild(label);
  inputField.appendChild(inputElement);
  if (text) inputField.appendChild(helpText);
  return inputField;
};
const Select = (name, required, options) => {
  const select = document.createElement("select");
  select.setAttribute("name", name);
  select.setAttribute("id", name);
  select.toggleAttribute("required", required);
  const defaultOption = document.createElement("option");
  defaultOption.setAttribute("value", "");
  defaultOption.textContent = INPUT_HELP_TEXT.SELECT_PLACEHOLDER;
  select.appendChild(defaultOption);
  for (const [key, value] of Object.entries(options)) {
    const optionTag = document.createElement("option");
    optionTag.setAttribute("value", key);
    optionTag.textContent = value;
    select.appendChild(optionTag);
  }
  return select;
};
const TextArea = (name, required = false) => {
  const textArea = document.createElement("textarea");
  textArea.setAttribute("type", "text");
  textArea.setAttribute("name", name);
  textArea.setAttribute("id", name);
  textArea.toggleAttribute("required", required);
  return textArea;
};
const BUTTON_TEXT = {
  CANCEL: "취소하기",
  ADD: "추가하기"
};
const CategoryImage = (category) => {
  const categoryImage = document.createElement("div");
  categoryImage.classList.add("restaurant__category");
  const src = `./category-${FOOD_CATEGORY[category]}.png`;
  categoryImage.appendChild(Image(src, category, "category-icon"));
  return categoryImage;
};
const Description = (text, ellipsis) => {
  const description = document.createElement("p");
  description.classList.add("restaurant__description", "text-body");
  description.textContent = text;
  {
    description.classList.add("text-ellipsis");
  }
  return description;
};
const Distance = (minute) => {
  const distance = document.createElement("span");
  distance.classList.add("restaurant__distance", "text-body");
  distance.textContent = `캠퍼스부터 ${minute}분 내`;
  return distance;
};
const RestaurantInfo = ({ name, distance, description }) => {
  const restaurantInfo = document.createElement("div");
  restaurantInfo.classList.add("restaurant__info");
  restaurantInfo.appendChild(
    Title(name, "h3", "restaurant__name", "text-subtitle")
  );
  restaurantInfo.appendChild(Distance(distance));
  restaurantInfo.appendChild(Description(description));
  return restaurantInfo;
};
const RestaurantCard = (restaurant) => {
  const { category, name, distance, description } = restaurant.info;
  const restaurantCard = document.createElement("li");
  restaurantCard.classList.add("restaurant");
  restaurantCard.prepend(CategoryImage(category));
  restaurantCard.appendChild(RestaurantInfo({ name, distance, description }));
  return restaurantCard;
};
const renderRestaurants = (...restaurantList2) => {
  const ulTag = $(".restaurant-list");
  [...restaurantList2].forEach((restaurant) => {
    ulTag.appendChild(RestaurantCard(restaurant));
  });
};
const ERROR_MESSAGE = {
  CATEGORY_FIELD_REQUIRED: "카테고리를 선택해주세요.",
  NAME_FIELD_REQUIRED: "이름을 입력해주세요.",
  DISTANCE_FIELD_REQUIRED: "거리를 선택해주세요."
};
const validateEmptyString = (string, message) => {
  if (string === "") throw new Error(message);
};
class Restaurant {
  constructor({ category, name, distance, description, link }) {
    __privateAdd(this, _info);
    __privateSet(this, _info, { category, name, distance, description, link });
    this.validate();
  }
  validate() {
    validateEmptyString(
      __privateGet(this, _info).category,
      ERROR_MESSAGE.CATEGORY_FIELD_REQUIRED
    );
    validateEmptyString(__privateGet(this, _info).name, ERROR_MESSAGE.NAME_FIELD_REQUIRED);
    validateEmptyString(
      __privateGet(this, _info).distance,
      ERROR_MESSAGE.DISTANCE_FIELD_REQUIRED
    );
  }
  get info() {
    return {
      ...__privateGet(this, _info)
    };
  }
}
_info = new WeakMap();
const restaurantList = [
  new Restaurant({
    category: "한식",
    name: "피양콩할마니",
    distance: WALK_TIME_MINUTES[0],
    description: "평양 출신의 할머니가 수십 년간 운영해온 비지 전문점 피양콩 할마니. 두부를 빼지 않은 되비지를 맛볼 수 있는 곳으로, ‘피양’은 평안도 사투리로 ‘평양’을 의미한다. 딸과 함께 운영하는 이곳에선 맷돌로 직접 간 콩만을 사용하며, 일체의 조미료를 넣지 않은 건강식을 선보인다. 콩비지와 피양 만두가 이곳의 대표 메뉴지만, 할머니가 옛날 방식을 고수하며 만들어내는 비지전골 또한 이 집의 역사를 느낄 수 있는 특별한 메뉴다. 반찬은 손님들이 먹고 싶은 만큼 덜어 먹을 수 있게 준비돼 있다.",
    link: "http//localhost:30000"
  }),
  new Restaurant({
    category: "중식",
    name: "친친",
    distance: WALK_TIME_MINUTES[0],
    description: "설명입니다",
    link: "http//localhost:30000"
  }),
  new Restaurant({
    category: "일식",
    name: "잇쇼우",
    distance: WALK_TIME_MINUTES[0],
    description: "설명입니다",
    link: "http//localhost:30000"
  })
];
const clearError = () => {
  var _a;
  (_a = $(".error-message")) == null ? void 0 : _a.remove();
};
const clearInput = (formElement) => {
  $(formElement).reset();
};
const addIdToError = (id, validateFn) => {
  try {
    clearError();
    validateFn();
  } catch (e) {
    throw new Error(e.message, { cause: id });
  }
};
const validateStringLength = (string, { minLength, maxLength }) => {
  if (string.length <= maxLength && string.length >= minLength) return;
  if (minLength === 0) throw new Error(`${maxLength}자 이하를 작성해주세요.`);
  throw new Error(`${minLength}자 이상 ${maxLength}자 이하를 작성해주세요.`);
};
const getInfo = () => {
  const form = $("#register-form");
  const formData = new FormData(form);
  const info = Object.fromEntries(formData.entries());
  return validateInfo(info);
};
const validateInfo = (info) => {
  addIdToError(
    "category",
    () => validateEmptyString(info.category, ERROR_MESSAGE.CATEGORY_FIELD_REQUIRED)
  );
  addIdToError("name", () => {
    validateEmptyString(info.name, ERROR_MESSAGE.NAME_FIELD_REQUIRED);
    validateStringLength(info.name, { minLength: 1, maxLength: 20 });
  });
  addIdToError(
    "distance",
    () => validateEmptyString(info.distance, ERROR_MESSAGE.DISTANCE_FIELD_REQUIRED)
  );
  addIdToError(
    "description",
    () => validateStringLength(info.description, { minLength: 0, maxLength: 500 })
  );
  return info;
};
const Button = ({ text, style, onClick, type = "submit", id }) => {
  const button = document.createElement("button");
  button.textContent = text;
  button.setAttribute("type", type);
  button.setAttribute("id", id);
  button.classList.add("button", "text-caption");
  button.classList.add(style);
  button.addEventListener("click", onClick);
  return button;
};
const ErrorMessage = (message) => {
  const errorMessage = document.createElement("p");
  errorMessage.classList.add("error-message", "text-caption");
  errorMessage.textContent = message;
  return errorMessage;
};
const ButtonContainer = () => {
  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("button-container");
  buttonContainer.appendChild(
    Button({
      text: BUTTON_TEXT.CANCEL,
      style: "button--secondary",
      onClick: closeModal,
      type: "button",
      id: "cancel-button"
    })
  );
  buttonContainer.appendChild(
    Button({
      text: BUTTON_TEXT.ADD,
      style: "button--primary",
      onClick: (e) => registerRestaurant(e),
      id: "register-button"
    })
  );
  return buttonContainer;
};
const closeModal = () => {
  $(".modal-backdrop").classList.remove("open");
  clearInput("#register-form");
  clearError();
};
const registerRestaurant = (e) => {
  e.preventDefault();
  try {
    const info = getInfo();
    const restaurant = new Restaurant(info);
    restaurantList.push(restaurant);
    $(".modal-backdrop").classList.remove("open");
    renderRestaurants(restaurant);
    clearInput("#register-form");
  } catch (e2) {
    const currentInputField = $(`#${e2.cause}-form-item`);
    currentInputField.appendChild(ErrorMessage(e2.message));
  }
};
const RegisterForm = () => {
  const registerForm = document.createElement("form");
  registerForm.setAttribute("id", "register-form");
  registerForm.appendChild(
    InputField(
      Select(
        "category",
        true,
        createKeyValuePair(
          Object.keys(FOOD_CATEGORY),
          Object.keys(FOOD_CATEGORY)
        )
      )
    )
  );
  registerForm.appendChild(InputField(Input("name", true)));
  registerForm.appendChild(
    InputField(
      Select(
        "distance",
        true,
        createKeyValuePair(
          WALK_TIME_MINUTES,
          WALK_TIME_MINUTES.map((minute) => minute + "분 내")
        )
      )
    )
  );
  registerForm.appendChild(
    InputField(TextArea("description"), INPUT_HELP_TEXT.DESCRIPTION)
  );
  registerForm.appendChild(InputField(Input("link"), INPUT_HELP_TEXT.LINK));
  registerForm.appendChild(ButtonContainer());
  return registerForm;
};
const registerModalClose = () => {
  $(".modal-backdrop").classList.remove("open");
  clearInput("#register-form");
};
addEventListener("load", () => {
  $("#app").prepend(header());
  renderRestaurants(...restaurantList);
  $("main").appendChild(
    Modal(
      registerModalClose,
      Title("새로운 음식점", "h2", "modal-title", "text-title"),
      RegisterForm()
    )
  );
});
