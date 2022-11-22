const deleteBtns = document.querySelectorAll('.delete-post-btn');
const slugs = document.querySelectorAll('.slug');

deleteBtns.forEach((deleteBtn, i) => {
  deleteBtn.addEventListener('click', async () => {
    const code = prompt('Enter code here');

    if (code === null || code.trim() === '') {
      return console.log('canceled');
    }

    const response = await fetch('/posts/delete', {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        secretCode: code,
        slug: slugs[i].textContent,
      }),
    });

    if (!response.ok) return console.log('an error occured.');

    location.href = '/';
  });
});
