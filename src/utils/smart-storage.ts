import { decrypt as aesDecrypt, encrypt as aesEncrypt } from 'crypto-js/aes'
import UTF8, { parse } from 'crypto-js/enc-utf8'
import pkcs7 from 'crypto-js/pad-pkcs7'
import CTR from 'crypto-js/mode-ctr'

interface EncryptionParams {
  key: string
  iv: string
}
/**  */
export interface Encryption {
  encrypt: (plainText: string) => string
  decrypt: (cipherText: string) => string
}

const cacheConfig = {
  // key: '385f33cb91484b04a177828829081ab7',
  key: '385f33cb91484b00',
  iv: '37fa77f6a3b0462d',
}

class AesEncryption implements Encryption {
  private readonly key // 32 bytes
  private readonly iv // 16 bytes

  constructor({ key, iv }: EncryptionParams) {
    this.key = parse(key)
    this.iv = parse(iv)
  }

  // AES encryption options
  get getOptions() {
    return {
      mode: CTR, // Counter block mode
      padding: pkcs7, // PKCS7 padding
      iv: this.iv, // Initialization vector
    }
  }

  encrypt(plainText: string) {
    return aesEncrypt(plainText, this.key, this.getOptions).toString()
  }

  decrypt(cipherText: string) {
    return aesDecrypt(cipherText, this.key, this.getOptions).toString(UTF8)
  }
}

export interface CreateSmartStorageParams extends EncryptionParams {
  prefixKey: string
  storage: Storage
  hasEncryption: boolean
  timeout?: number | null
}

/**
 * localStorage工厂方法实现
 */
export function CreateSmartStorage({
  prefixKey = '',
  storage = localStorage,
  key = cacheConfig.key,
  iv = cacheConfig.iv,
  timeout = null,
  hasEncryption = true,
}: Partial<CreateSmartStorageParams> = {}) {
  if (hasEncryption && [key.length, iv.length].some(item => item !== 16))
    // console.log('When hasEncript is true, the key or iv must be 16 bits!', key.length, iv.length)
    throw new Error('When hasEncript is true, the key or iv must be 16 bits!')

  const persistEncryption: Encryption = new AesEncryption({
    key: cacheConfig.key,
    iv: cacheConfig.iv,
  })

  /**
   * Cache Class
   * Construction parameters can be passed intolocalStorage,
   * @class Cache
   * @example
   */
  const SmartStorage = class SmartStorage {
    private storage: Storage
    private prefixKey?: string
    private encryption: Encryption
    private hasEncrypt: boolean

    /**
     * @param {*} storage
     */
    constructor() {
      this.storage = storage
      this.prefixKey = prefixKey
      this.encryption = persistEncryption
      this.hasEncrypt = hasEncryption
    }

    private getKey(key: string) {
      return `${this.prefixKey}${key}`
    }

    /**
     * set cache
     * @param {string} key
     * @param {*} value
     * @param {*} expire Expiration time in seconds
     * @memberof Cache
     */
    set(key: string, value: any, expire: number | null = timeout) {
      const k = this.prefixKey && key.includes(this.prefixKey) ? key : this.getKey(key)
      const stringData = JSON.stringify({
        value,
        time: Date.now(),
        expire: expire === null ? null : new Date().getTime() + expire * 1000,
      })
      const stringifyValue = this.hasEncrypt ? this.encryption.encrypt(stringData) : stringData
      this.storage.setItem(k, stringifyValue)
    }

    /**
     * Read cache
     * @param {string} key
     * @param {*} def
     * @memberof Cache
     */
    get(key: string, def: any = null): any {
      const k = this.prefixKey && key.includes(this.prefixKey) ? key : this.getKey(key)
      const val = this.storage.getItem(k)
      if (!val)
        return
      try {
        const decVal = this.hasEncrypt ? this.encryption.decrypt(val) : val
        const data = JSON.parse(decVal)
        const { value, expire } = data
        if (expire === null || expire >= new Date().getTime())
          return value

        this.remove(key)
      }
      catch (err) {
        return def
      }
    }

    /**
     * Delete cache based on key
     * @param {string} key
     * @memberof Cache
     */
    remove(key: string) {
      const k = this.prefixKey && key.includes(this.prefixKey) ? key : this.getKey(key)
      this.storage.removeItem(k)
    }

    /**
     * Delete all caches of this instance
     */
    clear() {
      this.storage.clear()
    }
  }
  return new SmartStorage()
}
