// ----------- Global vars -------------
const modal = document.querySelector(".modal");

//For handling new question creation until db running
let allQuestions = [];

// ----------- Helpers ---------------

//TODO: add helper for modal content

const handleDisplay = (el, display) => {
  el.style.display = display;
};

const formattedDate = () => {
  return new Date().toLocaleString().split(",").slice(0, 1).join(" ");
};

//TODO: Truncate comments and questions at three lines

// -------- Get data from API and handle ----------

const getQuestions = async (questionId) => {
  const res = await fetch(
    `https://salty-anchorage-50289.herokuapp.com/questions/${questionId}`
  );
  const questions = await res.json();
  console.log(questions);
  return questions;
};

const handleGetQuestions = () => {
  getQuestions(10).then((questions) => {
    renderQuestions(questions);
    allQuestions = [...questions];
  });
};

// ---------- Create a Question ------------

// dummy data until we have db
const dummyData = {
  names: [
    "Beth Rose",
    "Sam Schmidt",
    "Sadie Frost",
    "Mike Hill",
    "Molly Brown",
    "Jon Smith",
    "Lucy Thompson",
  ],
  // Return below as functions or they won't be unique
  randomName: function () {
    return Math.floor(Math.random() * this.names.length);
  },
  threadId: function () {
    return allQuestions.length + 1;
  },
  questionId: function () {
    return allQuestions.length + 1;
  },
};

const createNewQuestion = () => {
  const question = document.getElementById("question-input").value;

  //TODO: Questions need values for both title and details, not just body
  const newQuestion = {
    user: {
      name: dummyData.names[dummyData.randomName()],
    },
    createdAt: formattedDate(),
    body: question,
    isAnswered: false,
    commentCount: 0,
    threadId: dummyData.threadId(),
  };

  if (question !== "") {
    allQuestions.unshift(newQuestion);
    renderQuestions(allQuestions);
  } else {
    alert("Please enter a question");
  }
};

// -------------- Render UI -------------------

const handleSubmitModalTransition = (el1, el2) => {
  document.getElementById(el1).addEventListener("click", () => {
    return (el2.innerHTML = `
        <div class="modal-body" style="height:18rem;padding:2rem 0">
          <h1 style="margin-top:6rem">Your project has been Submitted!</h1>
          <p style="padding-top:5px">Look for an email confirmation shortly.</p>
        </div>
        <div class="modal-footer">
						  <button class="close-modal" href="#">Close</button>
						</div>
    `);
  });
};

renderModalContent = (e) => {
  const modalContent = document.querySelector(".modal-content");
  if (e.target.id === "question-button") {
    modalContent.innerHTML = `
            <div class="modal-header">
				  <h1>Post a Question</h1>
				  <p>Make sure to add enough detail to provide context for others.</p>
			  </div>
			  <div class="modal-body">
				  <form id="question-form">
					  <input id="question-input" type="text" placeholder="Question" maxlength="100">
					  <textarea id="question-details" rows="8" placeholder="More Details"></textarea>
					  <div class="modal-footer">
						  <a class="close-modal" href="#">Cancel</a>
						  <button id="post-question-button" type="submit">Post</input>
					  </div>
				  </form>
			</div>
        `;
  } else if (e.target.id === "submit-button") {
    modalContent.innerHTML = `
        <div class="modal-header">
				  <h1>Submit your Project</h1>
				  <p>Provide your Github and any additional relevant links.</p>
			  </div>
			  <div class="modal-body">
				  <form id="submit-form">
                      <input type="text" id="githubLink" placeholder="Github Link">
                      <input type="text" placeholder="Additional Link (optional)">
					  <textarea rows="5" placeholder="Comments (optional)"></textarea>
					  <div class="modal-footer">
						  <a class="close-modal" href="#">Cancel</a>
						  <button type="submit" id="submit-project-button">Submit</button>
					  </div>
				  </form>
			</div>
        `;

    //TODO: Write separate css, create separate component for this in future
    //TODO: check input not empty

    handleSubmitModalTransition("submit-project-button", modalContent);
  }
};

const renderQuestions = (questions) => {
  let output = "";
  questions.forEach((question) => {
    output += `
            <li class="question-card">
              <div class="question-header">
                <div class="name">${question.user.name}</div>
                <div class="created-at">${question.createdAt}</div>
                ${question.isAnswered ? '<i class="fas fa-bookmark"></i>' : ""}
              </div>
              <div class="question-body">
                <p>
                  ${question.body}
                </p>
              </div>
              <div class="question-footer">
                <div class="comment-count">${question.commentCount} ${
      question.commentCount > 1 || question.commentCount === 0
        ? "comments"
        : "comment"
    }</div>
                <div class="view-thread">
                  <a href="#">View Thread</a>
                </div>
              </div>
			</li>
        `;
  });
  document.querySelector(".questions-thread").innerHTML = output;
};

// ------------- Init ---------------
const init = () => {
  handleGetQuestions();
};

// --------- Event Listeners ---------------

// Call init on load
document.addEventListener("DOMContentLoaded", init());

// Dynamic modal display
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal-button")) {
    handleDisplay(modal, "block");
    renderModalContent(e);
  } else if (
    e.target.classList.contains("close-modal") ||
    e.target.classList.contains("modal")
  ) {
    handleDisplay(modal, "none");
  }
  console.log(e.target);
});

document.querySelector(".modal").addEventListener("click", (e) => {
  e.preventDefault();
  if (e.target.id === "post-question-button") {
    createNewQuestion();
    handleDisplay(modal, "none");
  }
  //TODO: Handle project submission
});
