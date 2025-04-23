// utils/customConfirm.js

export const customConfirm = (message) => {
  return new Promise((resolve) => {
    const modal = document.createElement("div");
    modal.className =
      "custom-confirm-modal fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50";

    modal.innerHTML = `
        <div class="bg-white p-6 rounded shadow-md max-w-md text-center">
          <p class="mb-4 whitespace-pre-wrap">${message}</p>
          <div class="flex justify-center gap-4">
            <button id="confirmYes" class="bg-green-500 text-white px-4 py-2 rounded">Yes</button>
            <button id="confirmNo" class="bg-red-500 text-white px-4 py-2 rounded">No</button>
          </div>
        </div>
      `;

    document.body.appendChild(modal);

    modal.querySelector("#confirmYes").onclick = () => {
      resolve(true);
      modal.remove();
    };
    modal.querySelector("#confirmNo").onclick = () => {
      resolve(false);
      modal.remove();
    };
  });
};
