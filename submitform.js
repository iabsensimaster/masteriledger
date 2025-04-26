<script type="module">
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// Ganti ini sama URL dan API KEY project lo
const supabaseUrl = 'https://npiepxkylxakgamuxdqj.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5waWVweGt5bHhha2dhbXV4ZHFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2NTMyMDQsImV4cCI6MjA2MTIyOTIwNH0.FzxloIpAWqHiLUrqDNVhmghqpgFF7B9gcj8uzE_OW7s'
const supabase = createClient(supabaseUrl, supabaseKey)

async function submitForm() {
  const nama = document.getElementById('nama').value
  const uraian = document.getElementById('uraian').value
  const pos = document.getElementById('pos').value
  const nominal = document.getElementById('nominal').value
  const pembayaran = document.getElementById('pembayaran').value

  const fotoNota = document.getElementById('fotoNota').files[0]
  const buktiTransfer = document.getElementById('buktiTransfer').files[0]

  const timestamp = new Date().toISOString()

  // Upload Foto Nota
  const { data: fotoData, error: fotoError } = await supabase
    .storage
    .from('uploads')
    .upload(`fotoNota/${Date.now()}-${fotoNota.name}`, fotoNota, { cacheControl: '3600', upsert: true })

  if (fotoError) {
    alert('Gagal upload Foto Nota')
    console.error(fotoError)
    return
  }

  const fotoNotaUrl = `${supabaseUrl}/storage/v1/object/public/uploads/${fotoData.path}`

  let buktiTransferUrl = '-'
  if (pembayaran === 'Transfer' && buktiTransfer) {
    // Upload Bukti Transfer
    const { data: buktiData, error: buktiError } = await supabase
      .storage
      .from('uploads')
      .upload(`buktiTransfer/${Date.now()}-${buktiTransfer.name}`, buktiTransfer, { cacheControl: '3600', upsert: true })

    if (buktiError) {
      alert('Gagal upload Bukti Transfer')
      console.error(buktiError)
      return
    }

    buktiTransferUrl = `${supabaseUrl}/storage/v1/object/public/uploads/${buktiData.path}`
  }

  // Insert ke Table i_ledger
  const { error } = await supabase
    .from('i_ledger')
    .insert([
      {
        timestamp,
        nama,
        uraian,
        pos,
        nominal: parseInt(nominal.replace(/\D/g, '')), // hilangkan Rp dan titik
        foto_nota: fotoNotaUrl,
        pembayaran,
        bukti_transfer: buktiTransferUrl,
      }
    ])

  if (error) {
    alert('Gagal submit data!')
    console.error(error)
  } else {
    alert('Data berhasil dikirim!')
    // Reset form kalau mau
    document.getElementById('formLedger').reset()
  }
}

window.submitForm = submitForm
</script>
