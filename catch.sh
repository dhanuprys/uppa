echo "Cloning from registry"
git clone https://github.com/dhanuprys/uppa
cd uppa

echo "Registering and executing"
chmod +x patch.sh
./patch.sh

echo "Done."
echo "Saved in ./output/uppa.iso"