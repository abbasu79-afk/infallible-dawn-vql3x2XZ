// DOM কন্টেন্ট লোড হওয়ার পর
document.addEventListener("DOMContentLoaded", function () {
  initializeApp();
});

function initializeApp() {
  initializeUpload();
  initializeGallery();
  initializeEditing();
  initializeFilters();
}

// আপলোড ফাংশনালিটি
function initializeUpload() {
  const uploadArea = document.getElementById("uploadArea");
  const fileInput = document.getElementById("fileInput");
  const uploadPreview = document.getElementById("uploadPreview");

  // ড্রাগ এন্ড ড্রপ ইভেন্ট
  uploadArea.addEventListener("dragover", function (e) {
    e.preventDefault();
    uploadArea.classList.add("dragover");
  });

  uploadArea.addEventListener("dragleave", function () {
    uploadArea.classList.remove("dragover");
  });

  uploadArea.addEventListener("drop", function (e) {
    e.preventDefault();
    uploadArea.classList.remove("dragover");
    const files = e.dataTransfer.files;
    handleFiles(files);
  });

  // ফাইল ইনপুট চেঞ্জ
  fileInput.addEventListener("change", function (e) {
    handleFiles(e.target.files);
  });
}

function handleFiles(files) {
  const uploadPreview = document.getElementById("uploadPreview");

  for (let file of files) {
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();

      reader.onload = function (e) {
        const previewItem = document.createElement("div");
        previewItem.className = "preview-item fade-in-up";
        previewItem.innerHTML = `
                    <img src="${e.target.result}" alt="Preview">
                    <div class="preview-actions">
                        <button onclick="editImage(this)" class="btn-small">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="addToGallery(this)" class="btn-small">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                `;
        uploadPreview.appendChild(previewItem);

        // গ্যালারিতে অটো অ্যাড
        setTimeout(() => addToGallery(previewItem), 1000);
      };

      reader.readAsDataURL(file);
    }
  }
}

// গ্যালারি ফাংশনালিটি
function initializeGallery() {
  // স্যাম্পল ইমেজ লোড
  loadSampleImages();
}

function loadSampleImages() {
  const galleryGrid = document.getElementById("galleryGrid");
  const sampleImages = [
    "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=400",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=400",
    "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
  ];

  sampleImages.forEach((imgSrc, index) => {
    const galleryItem = document.createElement("div");
    galleryItem.className = "gallery-item fade-in-up";
    galleryItem.innerHTML = `
            <img src="${imgSrc}" alt="Gallery Image ${index + 1}">
            <div class="gallery-actions">
                <button onclick="editGalleryImage(this)" class="btn-small">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="deleteImage(this)" class="btn-small">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    galleryGrid.appendChild(galleryItem);
  });
}

function addToGallery(element) {
  const galleryGrid = document.getElementById("galleryGrid");
  const imgSrc = element.querySelector("img").src;

  const galleryItem = document.createElement("div");
  galleryItem.className = "gallery-item fade-in-up";
  galleryItem.innerHTML = `
        <img src="${imgSrc}" alt="Uploaded Image">
        <div class="gallery-actions">
            <button onclick="editGalleryImage(this)" class="btn-small">
                <i class="fas fa-edit"></i>
            </button>
            <button onclick="deleteImage(this)" class="btn-small">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;

  galleryGrid.prepend(galleryItem);

  // সাফল্য মেসেজ
  showNotification("ছবিটি গ্যালারিতে সংযুক্ত হয়েছে!", "success");
}

// এডিটিং ফাংশনালিটি
function initializeEditing() {
  // রেঞ্জ ইনপুট ইভেন্ট লিসেনার
  const editControls = ["brightness", "contrast", "saturation"];

  editControls.forEach((control) => {
    document.getElementById(control).addEventListener("input", updateImageEdit);
  });

  // ফিল্টার বাটন ইভেন্ট
  document.querySelectorAll(".filter-option").forEach((btn) => {
    btn.addEventListener("click", function () {
      document
        .querySelectorAll(".filter-option")
        .forEach((b) => b.classList.remove("active"));
      this.classList.add("active");
      applyFilter(this.dataset.filter);
    });
  });
}

function editGalleryImage(button) {
  const imgSrc = button.closest(".gallery-item").querySelector("img").src;
  editImageFromSrc(imgSrc);
}

function editImageFromSrc(imgSrc) {
  const editImage = document.getElementById("editImage");
  editImage.src = imgSrc;

  // এডিট সেকশনে স্ক্রল
  scrollToSection("edit");

  // রিসেট কন্ট্রোলস
  document.getElementById("brightness").value = 100;
  document.getElementById("contrast").value = 100;
  document.getElementById("saturation").value = 100;
  document
    .querySelectorAll(".filter-option")
    .forEach((btn) => btn.classList.remove("active"));
  document.querySelector('[data-filter="none"]').classList.add("active");

  showNotification("ছবি এডিটরের জন্য লোড হয়েছে!", "info");
}

function updateImageEdit() {
  const editImage = document.getElementById("editImage");
  const brightness = document.getElementById("brightness").value;
  const contrast = document.getElementById("contrast").value;
  const saturation = document.getElementById("saturation").value;

  editImage.style.filter = `
        brightness(${brightness}%)
        contrast(${contrast}%)
        saturate(${saturation}%)
    `;
}

function applyFilter(filter) {
  const editImage = document.getElementById("editImage");

  switch (filter) {
    case "grayscale":
      editImage.style.filter += " grayscale(100%)";
      break;
    case "sepia":
      editImage.style.filter += " sepia(100%)";
      break;
    case "vintage":
      editImage.style.filter += " sepia(50%) hue-rotate(-30deg)";
      break;
    default:
      editImage.style.filter = editImage.style.filter.replace(
        /grayscale\([^)]+\)|sepia\([^)]+\)|hue-rotate\([^)]+\)/g,
        ""
      );
  }
}

function saveEditedImage() {
  showNotification("ছবিটি সফলভাবে সেভ হয়েছে!", "success");
  // এখানে実際 সেভ করার লজিক যোগ করতে হবে
}

// ইউটিলিটি ফাংশন
function scrollToSection(sectionId) {
  document.getElementById(sectionId).scrollIntoView({
    behavior: "smooth",
  });
}

function deleteImage(button) {
  const galleryItem = button.closest(".gallery-item");
  galleryItem.style.animation = "fadeOut 0.3s ease";

  setTimeout(() => {
    galleryItem.remove();
    showNotification("ছবিটি ডিলিট করা হয়েছে", "warning");
  }, 300);
}

function showNotification(message, type = "info") {
  // একটি সাধারণ নোটিফিকেশন সিস্টেম
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;

  // স্টাইল যোগ
  notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${
          type === "success"
            ? "#48bb78"
            : type === "warning"
            ? "#ed8936"
            : "#4299e1"
        };
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 1rem;
        animation: slideInRight 0.3s ease;
    `;

  document.body.appendChild(notification);

  // অটো রিমুভ
  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove();
    }
  }, 3000);
}

// ফিল্টার ইনিশিয়ালাইজেশন
function initializeFilters() {
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      document
        .querySelectorAll(".filter-btn")
        .forEach((b) => b.classList.remove("active"));
      this.classList.add("active");
      filterGallery(this.dataset.filter);
    });
  });
}

function filterGallery(filter) {
  const galleryItems = document.querySelectorAll(".gallery-item");

  galleryItems.forEach((item) => {
    switch (filter) {
      case "recent":
        // সাম্প্রতিক আইটেম শো করার লজিক
        item.style.display = "block";
        break;
      case "favorite":
        // প্রিয় আইটেম শো করার লজিক
        item.style.display = "block";
        break;
      default:
        item.style.display = "block";
    }
  });
}

// CSS অ্যানিমেশন যোগ
const style = document.createElement("style");
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: scale(1);
        }
        to {
            opacity: 0;
            transform: scale(0.8);
        }
    }
    
    .btn-small {
        background: rgba(255,255,255,0.9);
        border: none;
        border-radius: 50%;
        width: 35px;
        height: 35px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
        color: #333;
    }
    
    .btn-small:hover {
        background: white;
        transform: scale(1.1);
    }
    
    .preview-actions, .gallery-actions {
        position: absolute;
        top: 10px;
        right: 10px;
        display: flex;
        gap: 5px;
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    .preview-item:hover .preview-actions,
    .gallery-item:hover .gallery-actions {
        opacity: 1;
    }
    
    .notification button {
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        padding: 0;
        width: 20px;
        height: 20px;
    }
`;
document.head.appendChild(style);
