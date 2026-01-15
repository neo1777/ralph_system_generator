function addTodo() {
    const input = document.getElementById("todoInput");
    const val = input.value.trim();
    if (!val) return;
    
    const li = document.createElement("li");
    li.innerHTML = `
        <span>${val}</span>
        <span class="delete" onclick="this.parentElement.remove()">✖</span>
    `;
    
    document.getElementById("todoList").appendChild(li);
    input.value = "";
    input.focus();
}

document.getElementById("todoInput").addEventListener("keypress", function(e) {
    if (e.key === "Enter") addTodo();
});
