document.querySelectorAll(".color-switchers .btn").forEach((button) => {
   button.addEventListener("click", function () {
       // Hapus kelas 'active' dari semua tombol
       document.querySelectorAll(".color-switchers .btn").forEach((btn) => btn.classList.remove("active"));
       
       // Tambahkan kelas 'active' ke tombol yang diklik
       button.classList.add("active");

       // Ambil nama warna dari kelas tombol
       const colorClass = button.classList[1];

       // Fungsi untuk mengganti tema warna
       function updateBodyTheme(colorClass) {
           const body = document.body;
           body.classList.remove("blue-theme", "orange-theme", "purple-theme", "green-theme");
           if (colorClass) {
               body.classList.add(`${colorClass}-theme`);
           }
       }

       // Jalankan fungsi updateBodyTheme dengan warna yang dipilih
       updateBodyTheme(colorClass);
   });
});

 const viewBtn = document.querySelector(".view-modal"),
    popup = document.querySelector(".popup"),
    close = popup.querySelector(".close"),
    field = popup.querySelector(".field"),
    input = field.querySelector("input"),
    copy = field.querySelector("button");

    viewBtn.onclick = ()=>{
      popup.classList.toggle("show");
    }
    close.onclick = ()=>{
      viewBtn.click();
    }

    copy.onclick = ()=>{
      input.select(); //select input value
      if(document.execCommand("copy")){ //if the selected text copy
        field.classList.add("active");
        copy.innerText = "Copied";
        setTimeout(()=>{
          window.getSelection().removeAllRanges(); //remove selection from document
          field.classList.remove("active");
          copy.innerText = "Copy";
        }, 3000);
      }
    }
