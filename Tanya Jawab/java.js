function doPost(e) {
    var sheet = SpreadsheetApp.openById("16B5__NO0JMZvWa_3TvTGMtke543NIPlHqbxq-vVQB_4").getSheetByName("Sheet1");
    var data = JSON.parse(e.postData.contents);
    
    sheet.appendRow([data.nama, data.pertanyaan, new Date()]);
    
    return ContentService.createTextOutput("Success").setMimeType(ContentService.MimeType.TEXT);
}

// script.js
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

    // Tambahkan komentar utama
    addComment(name, comment, null);

    // Bersihkan form setelah submit
    document.getElementById('commentForm').reset();
});

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

function showReplyForm(commentElement) {
    // Cek apakah form reply sudah ada, jika sudah maka tidak perlu membuat lagi
    if (commentElement.querySelector('.reply-form')) return;

    // Buat elemen form reply
    const replyForm = document.createElement('form');
    replyForm.classList.add('reply-form');
    replyForm.innerHTML = `
        <input type="text" class="reply-name" placeholder="Your name" required><br><br>
        <textarea class="reply-comment" placeholder="Your reply" rows="3" required></textarea><br><br>
        <button type="submit">Post Reply</button>
    `;

    // Tambahkan event listener untuk submit form reply
    replyForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Mencegah submit default

        // Ambil nilai dari form reply
        const name = replyForm.querySelector('.reply-name').value;
        const comment = replyForm.querySelector('.reply-comment').value;

        // Validasi sederhana
        if (name.trim() === '' || comment.trim() === '') {
            alert('Both name and reply are required!');
            return;
        }

        // Tambahkan balasan sebagai komentar anak
        addComment(name, comment, commentElement);

        // Hapus form setelah balasan dikirim
        replyForm.remove();
    });

    // Masukkan form reply ke dalam elemen komentar
    commentElement.appendChild(replyForm);
}

