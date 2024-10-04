#!/bin/bash

######################################################
#   __  __   ______   ______   ________      
#  /_/\/_/\ /_____/\ /_____/\ /_______/\     
#  \:\ \:\ \\:::_ \ \\:::_ \ \\::: _  \ \    
#   \:\ \:\ \\:(_) \ \\:(_) \ \\::(_)  \ \   
#    \:\ \:\ \\: ___\/ \: ___\/ \:: __  \ \  
#     \:\_\:\ \\ \ \    \ \ \    \:.\ \  \ \ 
#      \_____\/ \_\/     \_\/     \__\/\__\/ 
#                                            
# Author: SAS: SO Anj Squad
# Team:
#   - Gede Dhanu Purnayasa
#   - Gede Dira Agastya
#   - Ayu Nyoman Resti Amadhea
#   - Ni Made Dwijyothamy Oka 
#
# ------------------- OPEN SOURCE --------------------
#   Silahkan di-modifikasi tapi jangan COPY-PASTE!   #
######################################################

OUTPUT_DIR="./output"
MODULES_DIR="./modules"
ROOT_DIR="./rootfs"
mkdir -p $OUTPUT_DIR

#######################################################
# SLAX commands
# sb2dir -> ekstrak .sb menjadi direktori
# dir2sb -> membuat file .sb dari sebuah direktori
# genslaxiso -> membuat file ISO
#######################################################

# Open-vm tools untuk virtualisasi
echo "Packing web.sb"
rm -rf "$OUTPUT_DIR/ovt.sb" 2>/dev/null
dir2sb "$MODULES_DIR/ovt.sb" "$OUTPUT_DIR/ovt.sb"
echo "web.sb packed successfully"

# Membuat paket web
echo "Packing web.sb"
rm -rf "$OUTPUT_DIR/web.sb" 2>/dev/null
dir2sb "$MODULES_DIR/web.sb" "$OUTPUT_DIR/web.sb"
echo "web.sb packed successfully"

# Generate file ISO
genslaxiso -e 'chromium' -r "$ROOT_DIR" "$OUTPUT_DIR/uppa.iso" \
    "$OUTPUT_DIR/ovt.sb" \
    "$OUTPUT_DIR/firefox.sb" \
    "$OUTPUT_DIR/web.sb"