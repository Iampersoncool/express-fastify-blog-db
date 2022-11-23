const deleteBtns = document.querySelectorAll('.delete-post-btn');

deleteBtns.forEach((deleteBtn) => {
  const slug = deleteBtn.dataset.slug;

  deleteBtn.addEventListener('click', async (e) => {
    const code = prompt('Enter code here');

    try {
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
          slug,
        }),
      });

      if (!response.ok) throw new Error(response.statusText);

      location.href = '/';
    } catch (e) {
      console.log(e);
      alert('An error occured deleting the post.');
    }
  });
});
