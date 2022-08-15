const deleteBtn = document.querySelectorAll('.fa-trash')

//ejs had the item and it was a span 
const item = document.querySelectorAll('.item span')
const itemCompleted = document.querySelectorAll('.item span.completed')

//smurfs= event listener listening to all the spans
Array.from(deleteBtn).forEach((element) => {
    element.addEventListener('click', deleteItem)
})

//call mark complete function  below
Array.from(item).forEach((element) => {
    element.addEventListener('click', markComplete)
})

Array.from(itemCompleted).forEach((element) => {
    element.addEventListener('click', markUnComplete)
})

async function deleteItem() {
    const itemText = this.parentNode.childNodes[1].innerText
    try {

        //why dont we need full URL deleteItem?? because we on local if on HEROKU you need the link..Express doing this for us
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                'itemFromJS': itemText
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()

    } catch (err) {
        console.log(err)
    }
}

async function markComplete() {
    //markComplete connects to the server and has the route also
    const itemText = this.parentNode.childNodes[1].innerText
    try {
        const response = await fetch('markComplete', {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                'itemFromJS': itemText
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()

    } catch (err) {
        console.log(err)
    }
}

//child node grabbing todo (TEXT) and marked it (complete, etc) out of DOM then send it with the request
//without sending along the text DB wont know what to update
async function markUnComplete() {

    //itemText = the text you enter in the field (testing)
    const itemText = this.parentNode.childNodes[1].innerText
    try {
        const response = await fetch('markUnComplete', {
            method: 'put', //put request and the BODY
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                'itemFromJS': itemText //text in the DOM by trash can (just an example- i had put test, or testing), itemFromJS is the key and itemText is the value= testing
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()

    } catch (err) {
        console.log(err)
    }
}