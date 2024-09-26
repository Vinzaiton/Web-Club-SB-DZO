// script.js

// Memuat komentar dari server (Google Sheets) saat halaman di-load
document.addEventListener('DOMContentLoaded', function() {
    loadComments();
});

// Event listener untuk form submit
document.getElementById('commentForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Mencegah submit default

    // Ambil nilai dari input form
    const name = document.getElementById('name').value;
    const comment = document.getElementById('comment').value;

    // Validasi sederhana
    if (name.trim() === '' || comment.trim() === '') {
        alert('Both name and comment are required!');
        return;
    }

    // Kirim komentar ke server
    postCommentToServer(name, comment);

    // Bersihkan form setelah submit
    document.getElementById('commentForm').reset();
});

// Fungsi untuk memuat komentar dari server
function loadComments() {
    fetch('/get-comments') // URL untuk request ke backend
        .then(response => response.json())
        .then(data => {
            data.forEach(commentData => {
                addComment(commentData.name, commentData.comment, null);
            });
        })
        .catch(error => console.error('Error fetching comments:', error));
}

// Fungsi untuk menambahkan komentar baru ke DOM
function addComment(name, comment, parentElement) {
    const commentList = parentElement ? parentElement.querySelector('ul') : document.getElementById('commentList');

    // Buat elemen baru untuk komentar
    const newComment = document.createElement('li');
    newComment.innerHTML = `<strong>${name}</strong><p>${comment}</p>`;

    // Buat tombol "Jawab"
    const replyButton = document.createElement('button');
    replyButton.textContent = 'Jawab';
    replyButton.classList.add('reply-button');
    newComment.appendChild(replyButton);

    // Tambahkan daftar untuk balasan di bawah setiap komentar
    const replyList = document.createElement('ul');
    replyList.classList.add('reply-list');
    newComment.appendChild(replyList);

    // Tambahkan event listener untuk tombol "Jawab"
    replyButton.addEventListener('click', function() {
        showReplyForm(newComment);
    });

    // Masukkan komentar ke daftar (komentar utama atau balasan)
    commentList.appendChild(newComment);
}

// Fungsi untuk mengirim komentar ke server
function postCommentToServer(name, comment) {
    fetch('/post-comment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: name, comment: comment })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            addComment(name, comment, null); // Tambahkan komentar ke UI jika berhasil
        } else {
            console.error('Failed to post comment:', data.message);
        }
    })
    .catch(error => console.error('Error posting comment:', error));
}

// Fungsi untuk menampilkan form balasan
function showReplyForm(commentElement) {
    if (commentElement.querySelector('.reply-form')) return;

    const replyForm = document.createElement('form');
    replyForm.classList.add('reply-form');
    replyForm.innerHTML = `
        <input type="text" class="reply-name" placeholder="Your name" required><br><br>
        <textarea class="reply-comment" placeholder="Your reply" rows="3" required></textarea><br><br>
        <button type="submit">Post Reply</button>
    `;

    replyForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const name = replyForm.querySelector('.reply-name').value;
        const comment = replyForm.querySelector('.reply-comment').value;

        if (name.trim() === '' || comment.trim() === '') {
            alert('Both name and reply are required!');
            return;
        }

        // Kirim balasan ke server di sini (bisa disimpan di Spreadsheet dengan format tertentu)
        // ...

        addComment(name, comment, commentElement);
        replyForm.remove();
    });

    commentElement.appendChild(replyForm);
}
