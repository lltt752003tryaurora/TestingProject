let comments = [];

const fetchComments = async () => {
  const resp = await fetch("/static/comments.json");
  return await resp.json();  
}

const fetchUser = async (id) => {
  const resp = await fetch("/static/users.json");
  const usersData = await resp.json();
  return usersData.find(item => item.id === id);
}

const displayComments = async (issueId) => {
  const commentsData = await fetchComments();
  const issue = commentsData.find(item => item.issue === issueId);
  comments = issue?.comments || [];
  const container = document.getElementById("comments-container");

  container.innerText = "";

  // Container wrapper
  const wrapper = document.createElement("div");
  wrapper.classList.add("container");
  container.appendChild(wrapper);

  if (comments.length === 0) {
    wrapper.innerHTML = "<div class='container text-center'><i>No comments for this issue yet. You can post your comment, or track this issue for updates.</i></div>";
    return;
  }

  // Issue title
  const issueTitle = document.createElement("h2");
  issueTitle.classList.add("h4");
  issueTitle.innerText = issue.title;
  wrapper.appendChild(issueTitle);


  comments.forEach(async (comment) => {
    // Fetch comment's owner info
    const user = await fetchUser(comment.owner);

    // Comment container = header + content
    const cmtContainer = document.createElement("div");
    const indent = comment.level * 4;
    cmtContainer.classList.add("container", "border", "border-dark", "rounded-lg", "my-4", "py-4");
    wrapper.appendChild(cmtContainer);
    
    // Comment header = left + right
    const cmtHeader = document.createElement("div");
    cmtHeader.classList.add("d-flex", "flex-row", "justify-content-between", "align-items-center");
    cmtContainer.appendChild(cmtHeader);

    // Comment header left
    const cmtHeaderLeft = document.createElement("div");
    cmtHeaderLeft.classList.add("d-flex", "flex-row");
    cmtHeader.appendChild(cmtHeaderLeft);

    // Comment header left avatar
    const userAvatar = document.createElement("img");
    userAvatar.src = user.avatar;
    userAvatar.style = "max-height: 40px;";
    userAvatar.classList.add("rounded-circle", "mx-2");
    cmtHeaderLeft.appendChild(userAvatar);

    // Comment header left info
    const cmtInfo = document.createElement("div");
    const username = user.username;
    const createAt = comment.time;
    cmtInfo.innerHTML = `<div>${username}</div><div>${createAt}</div>`;
    cmtHeaderLeft.appendChild(cmtInfo);

    // Comment header right
    const cmtHeaderRight = document.createElement("div");
    cmtHeaderRight.classList.add("d-flex", "flex-row");
    // const watchIcon = document.createElement("i");
    // watchIcon.classList.add("fas", "fa-fw", "fa-eye");
    // const replyIcon = document.createElement("i");
    // replyIcon.classList.add("fas", "fa-fw", "fa-reply");
    // cmtHeaderRight.appendChild(replyIcon);
    // cmtHeaderRight.appendChild(watchIcon);
    cmtHeader.appendChild(cmtHeaderRight);

    // Comment body
    const cmtBody = document.createElement("div");
    cmtBody.classList.add("p-2");
    cmtContainer.appendChild(cmtBody);

    // Comment content
    const cmtContent = document.createElement("p");
    cmtContent.innerText = comment.content;
    cmtBody.appendChild(cmtContent);
  })
}


const addComment = async (newCmtContent) => {
  const newCmt = {
    id: comment.length + 1,
    owner: 0,
    time: "just now",
    content: newCmtContent,
    level: 0
  };
  comments.push(newCmt);

  const wrapper = document.querySelector("#comments-container").firstChild;

  // Fetch comment's owner info
  const user = await fetchUser(newCmt.owner);

  // Comment container = header + content
  const cmtContainer = document.createElement("div");
  const indent = newCmt.level * 4;
  cmtContainer.classList.add("container", "border", "border-dark", "rounded-lg", "my-4", "py-4");
  wrapper.appendChild(cmtContainer);
  
  // Comment header = left + right
  const cmtHeader = document.createElement("div");
  cmtHeader.classList.add("d-flex", "flex-row", "justify-content-between", "align-items-center");
  cmtContainer.appendChild(cmtHeader);

  // Comment header left
  const cmtHeaderLeft = document.createElement("div");
  cmtHeaderLeft.classList.add("d-flex", "flex-row");
  cmtHeader.appendChild(cmtHeaderLeft);

  // Comment header left avatar
  const userAvatar = document.createElement("img");
  userAvatar.src = user.avatar;
  userAvatar.style = "max-height: 40px;";
  userAvatar.classList.add("rounded-circle", "mx-2");
  cmtHeaderLeft.appendChild(userAvatar);

  // Comment header left info
  const cmtInfo = document.createElement("div");
  const username = user.username;
  const createAt = newCmt.time;
  cmtInfo.innerHTML = `<div>${username}</div><div>${createAt}</div>`;
  cmtHeaderLeft.appendChild(cmtInfo);

  // Comment header right
  const cmtHeaderRight = document.createElement("div");
  cmtHeaderRight.classList.add("d-flex", "flex-row");
  cmtHeader.appendChild(cmtHeaderRight);

  // Comment body
  const cmtBody = document.createElement("div");
  cmtBody.classList.add("p-2");
  cmtContainer.appendChild(cmtBody);

  // Comment content
  const cmtContent = document.createElement("p");
  cmtContent.innerText = newCmt.content;
  cmtBody.appendChild(cmtContent);
}