const SUPABASE_URL = 'https://npiepxkylxakgamuxdqj.supabase.co'; // Ganti dengan punyamu
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5waWVweGt5bHhha2dhbXV4ZHFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2NTMyMDQsImV4cCI6MjA2MTIyOTIwNH0.FzxloIpAWqHiLUrqDNVhmghqpgFF7B9gcj8uzE_OW7s';                  // Ganti dengan punyamu
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

document.getElementById('ledger-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const nama = document.getElementById('nama').value;
    const uraian = document.getElementById('uraian').value;
    const pos = document.getElementById('pos').value;
    const nominal = parseFloat(document.getElementById('nominal').value);

    const fotoNotaFile = document.getElementById('fotoNota').files[0];
    const pembayaran = document.getElementById('pembayaran').value;
    const buktiTransferFile = document.getElementById('buktiTransfer').files[0];

    let fotoNotaUrl = '';
    let buktiTransferUrl = '';

    if (fotoNotaFile) {
        const { data, error } = await supabase.storage.from('uploads').upload(`fotoNota/${Date.now()}_${fotoNotaFile.name}`, fotoNotaFile);
        if (data) {
            fotoNotaUrl = `${SUPABASE_URL}/storage/v1/object/public/uploads/${data.path}`;
        }
    }

    if (pembayaran === 'Transfer' && buktiTransferFile) {
        const { data, error } = await supabase.storage.from('uploads').upload(`buktiTransfer/${Date.now()}_${buktiTransferFile.name}`, buktiTransferFile);
        if (data) {
            buktiTransferUrl = `${SUPABASE_URL}/storage/v1/object/public/uploads/${data.path}`;
        }
    }

    const { error } = await supabase.from('i_ledger').insert([{
        Timestamp: new Date().toISOString(),
        Nama: nama,
        Uraian: uraian,
        Pos: pos,
        Nominal: nominal,
        Foto_Nota: fotoNotaUrl,
        Pembayaran: pembayaran,
        Bukti_Transfer: buktiTransferUrl
    }]);

    if (error) {
        alert('Gagal Simpan Data: ' + error.message);
    } else {
        alert('Data Berhasil Disimpan!');
        document.getElementById('ledger-form').reset();
    }
});
