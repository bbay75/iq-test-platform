export function ensureSessionId() {
  let sessionId = localStorage.getItem("session_id");

  if (!sessionId) {
    sessionId = "user_" + Math.random().toString(36).slice(2, 10);
    localStorage.setItem("session_id", sessionId);
  }

  return sessionId;
}

export function getTestsCompleted() {
  return Number(localStorage.getItem("tests_completed") || 0);
}

export function getFreeCredits() {
  return Number(localStorage.getItem("free_test_credits") || 0);
}

export function recordCompletedTest() {
  ensureSessionId();

  let completed = getTestsCompleted();
  let credits = getFreeCredits();

  completed += 1;

  if (completed >= 3) {
    credits += 1;
    completed -= 3;
  }

  localStorage.setItem("tests_completed", String(completed));
  localStorage.setItem("free_test_credits", String(credits));

  return {
    testsCompleted: completed,
    freeCredits: credits,
  };
}

export function useFreeCredit() {
  let credits = getFreeCredits();

  if (credits <= 0) {
    return false;
  }

  credits -= 1;
  localStorage.setItem("free_test_credits", String(credits));
  return true;
}
