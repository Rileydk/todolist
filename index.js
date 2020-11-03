/*Read Me
  1. 可透過點擊＋按鈕或enter新增內容（不可新增空白內容）
  2. 可勾選表示完成任務，也可取消勾選
  3. 可刪除不需要的項目
  4. 可編輯尚未完成的項目（不可為空白）
*/

/*修正
  文字換行對齊問題
*/

const container = document.querySelector('.container')
const todoList = container.querySelector('#todoList')
const doneList = container.querySelector('#doneList')

const model = {
  defaultTodos: ['Work out', 'Gain knowledge', 'Programming', 'Buy groceries', 'Hang out with friends', 'Meditate'],

  eventTypes: ['click', 'keypress']
}

const view = {
  appendTodoItem(item) {
    view.appendElement(todoList, view.createItemElement(item))
    view.appendCheckSignListener()
    view.appendEditColumnListener()
  },

  createItemElement(content) {
    let newItem = document.createElement('li')
    newItem.className = 'd-flex'
    newItem.innerHTML = `
      <i class="far fa-square mr-2 align-self-baseline  unchecked"></i>
      <label id="label" class="mr-2 align-self-baseline unfinished" for="todo">${content}</label>
      <i class="delete fa fa-trash align-self-baseline"></i>
    `
    return newItem
  },

  appendElement(node, newElement) {
    node.appendChild(newElement)
  },

  clearInput() {
    newInputValue.value = ''
  },

  removeItem(e) {
    e.target.parentElement.remove()
  },

  remindNoEmptyInput() {
    alert('Oops, you didn\'t type in anything.')
  },

  renderCheckedStyle() {
    doneList.lastElementChild.children[0].className = 'fas fa-check-square mr-2 align-self-baseline checked'
    doneList.lastElementChild.children[1].className = 'finished mr-2'
  },

  remindCompleteEditing() {
    alert('Please complete editing by pressing \'Enter(Return)\' before check the item!\n\nNotice that you need to select the edit column before pressing \'Enter(Return)\'.')
  },

  appendCheckSignListener() {
    todoList.lastElementChild.children[0].addEventListener('mouseover', e => { this.flashingCheckSign(e) })
    todoList.lastElementChild.children[0].addEventListener('mouseout', e => { this.haltFlashingCheckSign(e) })
  },

  flashingCheckSign(e) {
    e.target.className = 'fas fa-check-square mr-2 align-self-baseline turquoise unchecked'
  },

  haltFlashingCheckSign(e) {
    e.target.className = 'far fa-square mr-2 align-self-baseline unchecked'
  },

  appendEditColumnListener() {
    todoList.lastElementChild.children[1].addEventListener('mouseover', (e) => {
      this.showEditSign(e)
    })
    todoList.lastElementChild.children[1].addEventListener('mouseout', (e) => {
      this.hideEditSign(e)
    })
  },

  showEditSign(e) {
    if (!e.target.children[0] && e.target.tagName !== 'INPUT') {
      e.target.classList.add('edit-sign')
    }
  },

  hideEditSign(e) {
    e.target.classList.remove('edit-sign')
  },

  remindEditOneAtATime() {
    alert('You can only edit one item at a time!')
  },

  renderEditBlock(e) {
    const content = e.target.innerText
    e.target.innerHTML = `
      <input type="text" placeholder="${content}" id="new-value-input-column" class="form-control mt-2 mr-2" autofocus>`
    e.target.children[0].value = content
  },

  changeContent(e) {
    const newValueInputColumn = document.querySelector('#new-value-input-column')
    newValueInputColumn.addEventListener('keypress', event => {
      if (event.keyCode == 13) {
        if (e.target.children[0].value.trim() !== '') {
          e.target.innerText = e.target.children[0].value
          return
        }
        this.remindNoEmptyInput()
      }
    })
  }
}

const controller = {
  generateOriginList(item) {
    view.appendTodoItem(item)
  },

  dispatchTask(e) {
    const btnAddNewTodo = container.querySelector('#addNewTodo')
    const newInputValue = container.querySelector('#newInputValue')

    if (this.distinguishInputEvent(e)) {
      this.addNewInputValueToTodolist()

    } else if (e.target.matches('.delete')) {
      view.removeItem(e)

    } else if (e.target.matches('.checked')) {
      this.cancelMark(e)

    } else if (e.target.matches('.unchecked')) {
      this.markFinishedTask(e)

    } else if (e.target.matches('.unfinished')) {
      this.transferToEditMode(e)
    }
  },

  distinguishInputEvent(e) {
    return (e.target.matches('.addNewTodo') && e.type === 'click') || (e.target.matches('#newInputValue') && e.type === 'keypress' && e.keyCode == 13)
  },

  addNewInputValueToTodolist() {
    if (newInputValue.value.trim() !== '') {
      view.appendTodoItem(newInputValue.value)
      view.clearInput()
      return
    }
    view.remindNoEmptyInput()
  },

  markFinishedTask(e) {
    const item = e.target.nextElementSibling
    const editColumn = item.children[0]
    if (!editColumn) {
      view.removeItem(e)
      view.appendElement(doneList, view.createItemElement(item.innerText))
      view.renderCheckedStyle()
      return
    }
    view.remindCompleteEditing()
  },

  cancelMark(e) {
    view.removeItem(e)
    view.appendTodoItem(e.target.nextElementSibling.innerText)
  },

  transferToEditMode(e) {
    if (this.limitOneEditMode()) {
      view.hideEditSign(e)
      view.renderEditBlock(e)
      view.changeContent(e)
      return
    }
    view.remindEditOneAtATime()
  },

  limitOneEditMode() {
    const editMode = document.querySelector('#todoList input')
    return !editMode
  }
}


/* Main *//////////
model.defaultTodos.forEach(todo => controller.generateOriginList(todo))

model.eventTypes.forEach(eventType => container.addEventListener(eventType, e => { controller.dispatchTask(e) }))

/*
  綁定監聽器（事件觸發樣式）屬於controller還是view？(如appendEditColumnListener和appendCheckSignListener)
  將每一個使用者的操作動作裝在controller中，再調用view的method，適合嗎？
*/

/*可再增加
  美化警示窗格（改為modal？）
  Done區域隱藏/顯示toggle
  加上localStorage
  右鍵選擇文字顏色
  右鍵釘選（底色不同，刪除時警示提醒，可一鍵還原已勾選完成的所有釘選項目）
  拖曳變換排序
  復原上一步undo
  重複動作redo
*/