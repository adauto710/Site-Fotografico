<input type="file" accept="image/*" onchange="previewFoto(event)">
<br><br>
<img id="preview" width="300">

<script>
function previewFoto(event) {
  const img = document.getElementById("preview");
  img.src = URL.createObjectURL(event.target.files[0]);
}
