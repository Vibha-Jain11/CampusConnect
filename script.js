
const form = document.getElementById("postForm");
const input = document.getElementById("postInput");
const feed = document.getElementById("feed");
const status = document.getElementById("status");

form.addEventListener("submit", function(event) {
    event.preventDefault();

    const post = input.value.trim();

    if (post === "") {
        status.textContent = "Please enter a post!";
        return;
    }

    if (post.length > 200) {
        status.textContent =
            "Post must not exceed 200 characters!";
        return;
    }

    const postElement = document.createElement("p");
    postElement.textContent = post;

    feed.appendChild(postElement);
    input.value = "";

    status.textContent = "Post published successfully!";
});
